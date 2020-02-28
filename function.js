const AWS = require('aws-sdk');
const fs = require('fs');
const { aws_access_key, aws_secret_access_key } = require('./config.js');
const s3 = new AWS.S3({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_access_key
});

function test(params) {
    return new Promise((resolve, reject) => {
        const key = params.key;
        const bucketParams = {
            Bucket: 'mybucket-test-openwhisk',
            Key: key
        }

        const rs = s3.getObject(bucketParams).createReadStream();
        const uploadParams = {
            Bucket: 'mybucket-test-openwhisk',
            Key: 'thumbnails/' + key,
            Body: rs
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
    })
    
}

exports.main = test
