const TblrApi = require('../../third-api/tumblr_api')
    , {Extra} = require('telegraf');
// const GoogleSearch = require('../../third-api/google_cse');
// const Kbd = require('./keyboards');

module.exports = function (ctx) {
    let url = 'zjhou';
    let getBlogInfo  = TblrApi.getBlogInfo(url),
        getPhotoInfo = TblrApi.getPosts(url, {type: 'photo', limit: 20, offset: 0}),
        getVideoInfo = TblrApi.getPosts(url, {type: 'photo', limit: 20, offset: 0});

    Promise.all([getBlogInfo, getPhotoInfo, getVideoInfo])
        .then((resp) => {
            let blogInfo = `- blog info - \n` +
                `名称：${resp[0].blog.name}\n` +
                `描述：${resp[0].blog.description}\n` +
                `内容数目：${resp[0].blog.total_posts}\n` +
                `最后更新：${new Date(resp[0].blog.updated * 1000).toDateString()}\n` +
                `图片：${resp[1].total_posts}\n` +
                `视频：${resp[2].total_posts}\n`;

            ctx.reply(blogInfo, Extra.HTML());
        })
        .catch(e => ctx.reply(e.message));
};