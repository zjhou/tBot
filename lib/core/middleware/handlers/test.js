const TblrApi = require('../../third-api/tumblr_api');
const GoogleSearch = require('../../third-api/google_cse');

module.exports = function (ctx) {
    GoogleSearch('test')
        .then(data => {

            let titles = data.items
                .map(item => item.displayLink)
                .filter(title => /^(?!www)/.test(title));

            ctx.reply(titles.join("\n"));

        })
        .catch(err => ctx.reply(err));

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