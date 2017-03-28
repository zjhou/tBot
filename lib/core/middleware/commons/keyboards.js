const {Markup} = require('telegraf');

module.exports = {
    /**
     * send a keyboards with ten keys to user
     * @param promptWords
     * @param names
     * @returns {function(*)}
     */
    tenKbd: function (promptWords, names, ctx) {

        /**
         * complete arr to specific len with filler
         * @param {*} filler
         * @param {number} totalLen
         * @returns {*}
         */
        Array.prototype.completeWith = function (filler, totalLen) {
            totalLen = Math.abs(totalLen);
            if (Number.isInteger(totalLen)) {
                return this.length >= totalLen ?
                    this.slice(0, totalLen) :
                    this.concat(Array.from({
                        length: totalLen - this.length
                    }).fill(filler));
            } else {
                return this;
            }
        };

        names = names.completeWith("_", 9);

        ctx.reply(
            promptWords || '...', Markup
                .keyboard([
                    names.slice(0, 3),
                    names.slice(3, 6),
                    names.slice(6, 9),
                    ["SEARCH"]
                ]).extra()
        );
    }


};
