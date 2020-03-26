const { main } = require("./index");

const params = {
    'EXECUTION_TYPE': 'asynchronous',
    'OW_HOST': '127.0.0.1:3001',
    'KEY': '1.png'
}

main(params)
    .then(function(result) {
        console.log('Result: ', result);
    })
    .catch(function(error) {
        console.log('Error: ', error);
    })