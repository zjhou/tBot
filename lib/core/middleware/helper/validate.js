module.exports = function (isPrivate) {
    return function (ctx, next) {
        if (!isPrivate){
            next()
        } else {
            parseInt(ctx.from.id) === parseInt(process.env.ADMIN_ID) ?
                next() :
                ctx.reply("Can't access this command.");
        }
    }
};