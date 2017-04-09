const StateMachine = require('javascript-state-machine')
    , Kbd = require('../helper/keyboards')
    , TblrApi = require('../../third-api/tumblr_api')
    , {Extra, Markup} = require('telegraf')
    , GoogleSearch = require('../../third-api/google_cse');

module.exports = function (ctx) {
    ctx.session.fsm = StateMachine.create({
        initial: 'initsearch',
        events: [
            {name: 'commitkwd', from: 'initsearch', to: 'showurls'},
            {name: 'commiturl', from: ['showurls', 'showbloginfo', 'showphotos'], to: 'showbloginfo'},
            {name: 'return', from: ['showurls', 'showbloginfo'], to: 'initsearch'},
            {name: 'getphotos', from: ['showbloginfo', 'showphotos'], to: 'showphotos'},
            {name: 'listurls', from: 'showphotos', to: 'showurls'}
        ],
        callbacks: {
            oninitsearch: function (event, from, to) {
                ctx.reply("Please send me some keywords.")
            },

            oncommitkwd: function (event, from, to, keywords) {
                GoogleSearch(keywords)
                    .then(data => {
                        let results = data.items
                            .map(item => item.displayLink.split('.')[0])
                            .filter(title => /^(?!www)/.test(title));

                        ctx.session.urls = results;
                        Kbd.tenKbd("Click correspond button to view info", results, ctx);
                    })
                    .catch(err => ctx.reply(err.message));
            },

            onentershowurls: function () {
                let urls = ctx.session.urls;
                ctx.session.pageNow = 1;

                if (urls !== undefined) {
                    Kbd.tenKbd("Click correspond button to view info", urls, ctx);
                }
            },

            oncommiturl: function (event, from, to, url) {
                let getBlogInfo = TblrApi.getBlogInfo(url),
                    getPhotoInfo = TblrApi.getPosts(url, {type: 'photo', limit: 20, offset: 0}),
                    getVideoInfo = TblrApi.getPosts(url, {type: 'video', limit: 20, offset: 0});

                Promise.all([getBlogInfo, getPhotoInfo, getVideoInfo])
                    .then((resp) => {
                        ctx.session.blogInfo = {
                            name: resp[0].blog.name,
                            photo: {
                                recordNum: resp[1].total_posts,
                                pageNum: Math.ceil(resp[1].total_posts / 3),
                                pageNow: 0
                            },
                            video: {
                                recordNum: resp[2].total_posts,
                                pageNum: Math.ceil(resp[2].total_posts / 3),
                                pageNow: 0
                            }
                        };

                        let blogInfo = `- QUERY RESULTS - \n` +
                            `name：${resp[0].blog.name}\n` +
                            `description: ${resp[0].blog.description}\n` +
                            `total posts: ${resp[0].blog.total_posts}\n` +
                            `photo posts: ${resp[1].total_posts}\n` +
                            `video posts: ${resp[2].total_posts}\n` +
                            `last updated: ${new Date(resp[0].blog.updated * 1000).toDateString()}\n`;

                        return ctx.reply(blogInfo, Extra.HTML());

                    })
                    .then(() => ctx.reply("Now, you can:", Markup.inlineKeyboard([
                        Markup.callbackButton('get pictures', '_GETP'),
                        Markup.callbackButton('get videos', '_GETV')
                    ]).extra()))
                    .catch(err => ctx.reply(err.message))
            },

            ongetphotos: function (event, from, to, pagenow) {
                let blogInfo = ctx.session.blogInfo,
                    pageNow = ctx.session.pageNow || 1,
                    pageNum = blogInfo.photo.pageNum;

                if (pagenow === "_") {
                    ctx.reply("Nothing is here.");
                    return false;
                } else if (pagenow === "_NEXT") {
                    ctx.session.pageNow = pageNow < blogInfo.photo.pageNum ? pageNow + 1 : pageNow;
                } else if (pagenow === "_PREV") {
                    ctx.session.pageNow = pageNow > 1 ? pageNow - 1 : pageNow;
                } else if (pagenow === "_GETP") {
                    ctx.session.pageNow = 1;
                } else {
                    ctx.session.pageNow = parseInt(pagenow);
                }

                let blogName = blogInfo.name;
                TblrApi.getPosts(blogName, {
                    type: 'photo',
                    limit: 3,
                    offset: (ctx.session.pageNow - 1) * 3
                })
                    .then(resp => {
                        let imgUrls = resp.posts.map(post => post.photos[0].alt_sizes[1].url),
                            sendphotos = imgUrls.map(url => ctx.telegram.sendPhoto(ctx.chat.id, {url: url}));

                        return Promise.all(sendphotos)
                    })
                    .then(() => {
                        if (pageNum > 1){
                            if(pageNow === 1) ctx.session.pageNow = pageNow + 1;
                            let hasNext = ctx.session.pageNow + 1 <= pageNum,
                                nextPage = hasNext ? ctx.session.pageNow + 1 : 'none.';

                            Kbd.navKbd(`next page: ${nextPage}, total: ${pageNum}`, {
                                pageNow: ctx.session.pageNow,
                                pageNum: pageNum
                            }, ctx)
                        }
                    })
                    .catch(err => ctx.reply(err.message))
            }
        }
    });
};