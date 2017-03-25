const Tumblr = require('tumblr.js');
const PartUrl = ".tumblr.com";
const Client = Tumblr.createClient({
    consumer_key: process.env.TBLR_CONSUMER_KEY,
    returnPromises: true
});

module.exports = {
    /**
     * get general blog info of <blogName>.tumblr.com
     * @param {string} blogName
     */
    getBlogInfo: blogName => Client.blogInfo(blogName + PartUrl),

    /**
     * get post(s) from <blogName>.tumblr.com
     * @param {string} blogName
     * @param {object} opt
     * @param {string} opt.type - posts' type: 'text', 'link', 'chat', 'video', 'audio', 'photo'
     * @param {number} opt.limit - The number of posts to return: 1-20 inclusive
     * @param {number} opt.offset - Post number to start at
     * @returns {*}
     */
    getPosts: (blogName, opt) => {
        let param = Object.assign({
            type: 'photo',
            limit: 1,
            offset: 0
        }, opt);

        return Client.blogPosts(blogName, opt)
    },


};