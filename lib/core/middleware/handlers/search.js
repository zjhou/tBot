const StateMachine = require('javascript-state-machine')
    , Kbd = require('../commons/keyboards')
    , GoogleSearch = require('../../third-api/google_cse');

module.exports = function (ctx) {
    ctx.session.fsm = StateMachine.create({
        initial: 'initsearch',
        events: [
            {name: 'commitkwd', from: 'initsearch', to: 'showresult'},
        ],
        callbacks: {
            oninitsearch: function (event, from, to) {
                ctx.reply("Please send me some keywords.")
            },

            oncommitkwd: function (event, from, to, keywords) {
                GoogleSearch(keywords)
                    .then(data => {
                        let results = data.items
                            .map(item => item.displayLink)
                            .filter(title => /^(?!www)/.test(title));

                        ctx.session.results = results;
                        Kbd.tenKbd("Click correspond button to view info",
                            results.map(title => title.split('.')[0]), ctx);
                    })
                    .catch(err => ctx.reply(err.message));

                return StateMachine.ASYNC
            },
        }
    })
};