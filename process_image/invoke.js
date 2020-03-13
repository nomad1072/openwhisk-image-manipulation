const { main } = require('./function')

main({ key: '1.png' }).then((code) => {
    console.log('Code: ', code);
})
.catch((err) => {
    console.log('Error: ', err);
})