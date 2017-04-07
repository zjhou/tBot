/**
 * 状态转移表，根据输入和状态机当前状态确定转换函数，间接确定下一个状态
 * @param {string} input
 * @param {string} currentState
 */

module.exports = function (input, currentState) {
    const STT = {
        //              0:kwd        1:url
        initsearch:   ['commitkwd', 'commitkwd'],
        showurls:     [ false,      'commiturl'],
        showbloginfo: ['return',    'commiturl'],
    };

    let inputCode = getInCode(input);

    function getInCode(input) {
        // two numbers
        if(/^\s*\d+\s*\d+\s*$/.test(input)){
            return 2;
        }

        // url
        if(/[0-9a-zA-Z-]+/.test(input)){
            return 1;
        }

        return 0;
    }

    return STT[currentState][inputCode] || false;
};