(async function() {
    const jimp = require('jimp')
    const path = require('path');
    const fs = require('fs');

    const rs = fs.readFileSync(path.join(__dirname, '../upload/images', '1.png'));
    console.log('Rs: ', rs);
    const image = await jimp.read(rs)
    const result = await image.resize(256, 256).grayscale().getBuffer('image/png', function(err,buffer) {
        console.log('Buffer: ', buffer);
    });
    console.log('Result: ', result);
})();