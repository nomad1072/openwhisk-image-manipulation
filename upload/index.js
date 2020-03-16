const { blocking } = require('./execution/blocking');
const { asynchronous } = require('./execution/asynchronous');

function test(params) {
    console.log('Params: ', params);

    if(params.EXECUTION_TYPE === 'blocking') {
        return blocking(params)
    } else if(params.EXECUTION_TYPE === 'asynchronous') {

    }
}

exports.main = test
