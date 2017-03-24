const Telegraf = require('telegraf');
const BOT = new Telegraf(process.env.TBLR_BOT_TOKEN);
BOT.use(ctx => console.log(ctx.from));
BOT.hears("hello", ctx => ctx.reply("world."));
BOT.startPolling();
