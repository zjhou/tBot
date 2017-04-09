const TblrApi = require('../../third-api/tumblr_api')
    , {Extra} = require('telegraf');
// const GoogleSearch = require('../../third-api/google_cse');
const Kbd = require('../helper/keyboards');

module.exports = function (ctx) {
    Kbd.navKbd("keyboard test", {
        pageNum: 20,
        pageNow: 16,
    }, ctx)
};