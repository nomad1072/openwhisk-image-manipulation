const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

module.exports.asynchronous = function(params) {

    const s3 = new AWS.S3({
        accessKeyId: params.AWS_ACCESS_KEY,
        secretAccessKey: params.AWS_SECRET
    });
    const BUCKET = params.BUCKET

    return new Promise((resolve, reject) => {
        const key = params.KEY;

        const fileBuffer = fs.readFileSync(path.join(__dirname, "../../upload/triggers", key));
        const image = await jimp.read(fileBuffer);
        const result = await image.resize(256, 256).grayscale().getBuffer('image/png', function(err,buffer) {
            console.log('Buffer: ', buffer);
            const uploadParams = {
                Bucket: BUCKET,
                Key: 'thumbnails/' + key,
                Body: buffer
            }
            const uploadPromise = s3.upload(uploadParams).promise();
            uploadPromise.then((uploaded) => {
                console.log('Uplaoded: ', uploaded)
                resolve({
                    msg: 'Image processed and uploaded'
                })
            }).catch((err) => {
                reject({
                    msg: 'Image processing failed'
                })
            })
        });
    })
};