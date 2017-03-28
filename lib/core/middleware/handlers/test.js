const TblrApi = require('../../third-api/tumblr_api');
const GoogleSearch = require('../../third-api/google_cse');
const Kbd = require('../commons/keyboards');

module.exports = function (ctx) {
    GoogleSearch('test')
        .then(data => {
            let titles = data.items
                .map(item => item.displayLink)
                .filter(title => /^(?!www)/.test(title));

            Kbd.tenKbd("Click correspond button to view info",
                titles.map(title => title.split('.')[0]), ctx);

        })
        .catch(err => ctx.reply(JSON.stringify(err)));

    TblrApi.getBlogInfo('zjhou')
        .then(res => {
            ctx.reply(`blogName: ${res.blog.name}\ntotal posts: ${res.blog.total_posts}\n`)
        })
        .catch(err => ctx.reply(JSON.stringify(err)));

    TblrApi.getPosts('zjhou', {
        type: 'photo',
        limit: 1,
        offset: 0
    })
        .then(resp => {
            let picUrl = resp.posts[0].photos[0].alt_sizes[1].url;
            ctx.telegram.sendPhoto(ctx.chat.id, {
                url: picUrl
            })
        })
        .catch(err => ctx.reply(JSON.stringify(err)))
};