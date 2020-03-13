const { blocking } = require('./execution/blocking');

function test(params) {
    console.log('Params: ', params);

    if(EXECUTION_TYPE === 'blocking') {
        return blocking(params)
    }
}

exports.main = test
