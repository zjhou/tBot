# ![profile](/docs/tbot_profile.png)
**tBot** A telegram bot who can search and get content from tumblr.


## config

Set following environment variables:

- TBLR_BOT_TOKEN
- ADMIN_ID
- TBLR_CONSUMER_KEY
- GOOGLE_CSE_KEY
- GOOGLE_CSE_CX

You can get your bot token from bot father. `ADMIN_ID` is your telegram account id,
here, I get it from `ctx.from.id`. tBot can recognize you by id so that it can provide you
private service, just expand your command sets in the `router.js` file.

The bot search content based on google custom search engine(google cse),  read google
api page for more details.


## run

Deploy the code to your server, then use command `node lib/bot.js` to bring your bot alive. `pm2 start lib/bot.js` is a better choice.



