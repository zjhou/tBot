# ![profile](/docs/tbot_profile.png)
**tBot**, a telegram bot who can search and get content from tumblr.


## config

Set following environment variables:

1. TBLR_BOT_TOKEN
2. ADMIN_ID
3. TBLR_CONSUMER_KEY
4. GOOGLE_CSE_KEY
5. GOOGLE_CSE_CX

You can get your bot token from bot father. 
 
`ADMIN_ID` is your telegram account id,
here, I get it from `ctx.from.id`. tBot can recognize you by id so that it can provide you
private service, just expand your command sets in the `router.js` file, and add correspond handler.
 
You need consumer key to access tumblr api, it's easy to resgister one. [More infomation](https://api.tumblr.com)

The bot search content based on google custom search engine(google cse), customize your own search engine [here](https://cse.google.com).


## run

Deploy the code to your server, then use command `node lib/bot.js` to bring your bot alive. `pm2 start lib/bot.js` is a better choice.


## demo

`@tblr_bot` in telegram.
