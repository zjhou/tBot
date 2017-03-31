const axios = require('axios');
/**
 * google custom search engine.
 * @param {string} kwd - search key words
 */
module.exports = function (kwd) {
    const reqUrl = `https://www.googleapis.com/customsearch/v1` +
    `?key=${process.env.GOOGLE_CSE_KEY}` +
    `&cx=${process.env.GOOGLE_CSE_CX}&q=${encodeURI(kwd)}`;

    console.log(reqUrl);
    return new Promise(function (resolve, reject) {
        axios.get(reqUrl)
            .then(resp => {
                if(resp.status === '200'){
                    resolve(resp.data)
                }else{
                    reject(new Error("Status: " + resp.status))
                }
            })
            .catch(err => reject(new Error(err)))
    })
};