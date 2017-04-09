/**
 * 状态转移表，根据输入和状态机当前状态确定转换函数，间接确定下一个状态
 * @param {string} input
 * @param {string} currentState
 */

module.exports = function (input, currentState) {
    const STT = {
        //              0:kwd        1:url        2:num        3: _GETP    4: << BACK  5: _NEXT     6: _PREV     7: _
        initsearch:   ['commitkwd', 'commitkwd', 'commitkwd',  false,      false,      false,       false,       false   ],
        showurls:     [ false,      'commiturl', 'commiturl',  false,      false,      false,       false,       false     ],
        showbloginfo: ['return',    'commiturl',  false,      'getphotos', false,      false,       false,       false     ],
        showphotos:   [ false,      'commiturl', 'getphotos',  false,     'listurls', 'getphotos', 'getphotos', 'getphotos' ]
    };

    let inputCode = getInCode(input);

    function getInCode(input) {
        if(input === "_") {
            return 7
        }
        if(input === "_PREV") {
            return 6
        }
        if(input === "_NEXT") {
            return 5
        }
        if(input === "<< BACK"){
            return 4;
        }
        if(input === "_GETP")  {
            return 3;
        }
        if(/^\s*\d+\s*$/.test(input)){
            return 2;
        }
        if(/[0-9a-zA-Z-]+/.test(input)){
            return 1;
        }
        return 0;
    }

    return STT[currentState][inputCode] || false;
};