const Route = require('./router');
const Validate = require('./middleware/helper/validate');

module.exports = function (bot) {
    Route.forEach(cmd => {
        bot.command(cmd.name, Validate(cmd.isPrivate), ctx => {
            try{
                return require('./middleware/handlers/' + cmd.handler)(ctx);
            }catch (e) {
                console.dir(e);
                return (ctx => ctx.reply("Handler error: " + e.message))(ctx);
            }
        })
    });

    return bot;
};