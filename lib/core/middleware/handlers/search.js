const StateMachine = require('javascript-state-machine')
    , Kbd = require('../helper/keyboards')
    , TblrApi = require('../../third-api/tumblr_api')
    , {Extra} = require('telegraf')
    , GoogleSearch = require('../../third-api/google_cse');

module.exports = function (ctx) {
    ctx.session.fsm = StateMachine.create({
        initial: 'initsearch',
        events: [
            {name: 'commitkwd', from: 'initsearch', to: 'showurls'},
            {name: 'commiturl', from: ['showurls', 'showbloginfo'], to: 'showbloginfo'},
            {name: 'return',    from: ['showurls', 'showbloginfo'], to: 'initsearch'}
        ],
        callbacks: {
            oninitsearch: function (event, from, to) {
                ctx.reply("Please send me some keywords.")
            },

            oncommitkwd: function (event, from, to, keywords) {
                GoogleSearch(keywords)
                    .then(data => {
                        let results = data.items
                            .map(item => item.displayLink)
                            .filter(title => /^(?!www)/.test(title));

                        ctx.session.results = results;
                        Kbd.tenKbd("Click correspond button to view info",
                            results.map(title => title.split('.')[0]), ctx);
                    })
                    .catch(err => ctx.reply(err.message));
            },
            
            oncommiturl: function (event, from, to, url) {
                let getBlogInfo  = TblrApi.getBlogInfo(url),
                    getPhotoInfo = TblrApi.getPosts(url, {type: 'photo', limit: 20, offset: 0}),
                    getVideoInfo = TblrApi.getPosts(url, {type: 'video', limit: 20, offset: 0});

                Promise.all([getBlogInfo, getPhotoInfo, getVideoInfo])
                    .then((resp) => {
                        let blogInfo = `- QUERY RESULTS - \n` +
                            `name：${resp[0].blog.name}\n` +
                            `description: ${resp[0].blog.description}\n` +
                            `total posts: ${resp[0].blog.total_posts}\n` +
                            `photo posts: ${resp[1].total_posts}\n` +
                            `video posts: ${resp[2].total_posts}\n` +
                            `last updated: ${new Date(resp[0].blog.updated * 1000).toDateString()}\n`;

                        return ctx.reply(blogInfo, Extra.HTML());

                    })
                    .then(() => ctx.reply('test'))
                    .catch(err => ctx.reply(err.message))
            }
        }
    });
};