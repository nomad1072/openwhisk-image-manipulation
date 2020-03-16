const AWS = require('aws-sdk');
const jimp = require('jimp');

module.exports.blocking = function(params) {
    
    const s3 = new AWS.S3({
        accessKeyId: params.AWS_ACCESS_KEY,
        secretAccessKey: params.AWS_SECRET
    });
    const BUCKET = params.BUCKET
    return new Promise(async (resolve, reject) => {
        const key = params.KEY;
        const bucketParams = {
            Bucket: BUCKET,
            Key: key
        }

        const rs = await s3.getObject(bucketParams).promise();
        console.log('RS: ', rs);
        const image = await jimp.read(rs.Body)
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