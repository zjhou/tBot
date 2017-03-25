const Route = require('./router');
const Validate = require('./middleware/commons/validate');

module.exports = function (bot) {
    Route.forEach(cmd => {
        bot.command(cmd.name, Validate(cmd.isPrivate), ctx => {
            try{
                return require('./middleware/handlers/' + cmd.handler)(ctx);
            }catch (e) {
                return ctx => ctx.reply("Internal error: Handler missing.");
            }
        })
    });

    return bot;
};