module.exports = function (isPrivate) {
    return function (ctx, next) {
        if (!isPrivate){
            next()
        } else {
            ctx.from.id == process.env.ADMIN_ID ?
                next() :
                ctx.reply("Can't access this command.");
        }
    }
};