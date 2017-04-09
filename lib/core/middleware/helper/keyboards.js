const {Markup} = require('telegraf');

module.exports = {
    /**
     * send a keyboards with ten keys to user
     * @param promptWords
     * @param names
     * @param {object} ctx
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
                    ["/search"]
                ]).extra()
        );
    },

    navKbd: function (promptWords, opt, ctx) {
        Number.prototype.isBetween = function (x, y) {
            return this > x && this < y
        };

        let param = Object.assign({
            pageNow: 0,
            pageNum: 0,
        }, opt);

        let keys = Array.from({length: 6}).fill("_"),
            pageNow = parseInt(param.pageNow),
            pageNum = parseInt(param.pageNum);

        // OPTIMIZE - add variables to config nav -ZJH
        if (pageNum.isBetween(0, 6)) {
            keys = keys.map((keyValue, index) => {
                return index <= pageNum - 1 ? index + 1 : keyValue;
            });
        } else if (pageNum.isBetween(5, 10)) {
            if (pageNow.isBetween(0, 6)) {
                keys = keys.map((keyVal, idx) => idx + 1);
                keys[5] = "_NEXT";
            } else if (pageNow.isBetween(5, 10)) {
                keys = keys.map((keyVal, idx) => {
                    return idx <= pageNum - 5 ? idx + 5 : keyVal;
                });
                keys[0] = "_PREV"
            }
        } else {
            if (pageNow.isBetween(0, 6)) {
                keys = keys.map((keyVal, idx) => idx + 1);
                keys[5] = "_NEXT";
            } else if (pageNow.isBetween(5, Infinity)) {
                let midNavNum = Math.floor((pageNum - 5) / 4);
                if (pageNum - pageNow <= 3) {
                    keys = keys.map((keyVal, idx) => {
                        return idx <= pageNum - (5 + midNavNum * 4) ?
                            idx + 5 + midNavNum * 4 : keyVal;
                    });
                    keys[0] = "_PREV"
                } else if (pageNum - pageNow > 3) {
                    let n = Math.floor((pageNow - 5)/4);
                    keys = keys.map((keyVal, idx) => 5 + 4 * n + idx);
                    keys[0] = "_PREV";
                    keys[5] = "_NEXT";
                }
            }
        }

        keys = keys.map(keyVal => keyVal.toString());
        ctx.reply(
            promptWords || '...', Markup
                .keyboard([
                    keys.slice(0, 3),
                    keys.slice(3, 6),
                    ["<< BACK"],
                    ["/search"],
                ]).extra()
        );
    }
};
