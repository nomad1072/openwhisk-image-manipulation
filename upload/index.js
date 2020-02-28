const AWS = require('aws-sdk');
const fs = require('fs');
const shell = require('shelljs');
const { aws_access_key, aws_secret_access_key } = require('./config.js');
const s3 = new AWS.S3({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_access_key
});

function test(params) {
    return new Promise((resolve, reject) => {
        const key = params.key;
        const rs = fs.createReadStream(path.join(__dirname, 'images', key));

        const uploadParams = {
            Bucket: 'mybucket-test-openwhisk',
            Key: key,
            Body: rs
        }
        const uploadPromise = s3.upload(uploadParams).promise();
        uploadPromise.then((uploaded) => {
            console.log('Uplaoded: ', uploaded)
            if (shell.exec(`wsk action invoke /whisk.system/processImage --result --param key ${key}`).code !== 0) {
                resolve({
                    msg: 'Image processed and uploaded'
                })
            } else {
                resolve({
                    msg: 'Image not processed'
                })
            } 
        }).catch((err) => {
            reject({
                msg: 'Image processing failed'
            })
        })
    })
    
}

exports.main = test
