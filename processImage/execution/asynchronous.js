const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

module.exports.asynchronous = function(params) {

    return new Promise((resolve, reject) => {
        
        const key = params.KEY;
        const fileBuffer = fs.readFileSync(path.join("/tmp/images", key));
        const image = await jimp.read(fileBuffer);
        const result = await image.resize(256, 256).grayscale().getBuffer('image/png', function(err,buffer) {
            if(err) {
                return reject({ msg: 'Error in resizing the image '})
            }
            fs.writeFileSync(path.join("/tmp/images/thumbnails", key), buffer);
            resolve({ msg: 'Image resized and uploaded to directory' })
        });
    })
};