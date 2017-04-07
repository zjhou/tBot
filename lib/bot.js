const Telegraf = require('telegraf')
    , BOT = new Telegraf(process.env.TBLR_BOT_TOKEN)
    , getTransFun = require('./core/middleware/helper/stateTransfTable')
    , {memorySession} = require('telegraf');

BOT.use(memorySession());
require('./core/controller')(BOT);

BOT.hears(/.*/, ctx => {
    try {
        let userInput = ctx.message.text
            , fsm = ctx.session.fsm
            , transFunName = getTransFun(userInput, fsm.current);

        if (transFunName) {
            fsm[transFunName](userInput);
        } else {
            ctx.reply('state: 404')
        }
    } catch (e) {
        console.dir(e);
    }
});

BOT.startPolling();
