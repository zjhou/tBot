const Telegraf = require('telegraf')
    , BOT = new Telegraf(process.env.TBLR_BOT_TOKEN)
    , {memorySession} = require('telegraf');

BOT.use(memorySession());
require('./core/controller')(BOT);

BOT.hears(/.*/, ctx => {
    try {
        if(ctx.session.fsm.current === 'initsearch'){
            ctx.session.fsm.commitkwd(ctx.message.text)
        }
    } catch (e) {
        ctx.reply('can not understand.')
    }
});
BOT.startPolling();
