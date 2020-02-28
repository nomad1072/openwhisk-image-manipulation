const AWS = require('aws-sdk');
const fs = require('fs');
const { aws_access_key, aws_secret_access_key } = require('config.js');
const s3 = new AWS.S3({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_access_key
});

function main(params) {
    const key = params.key;
    const params = {
        Bucket: 'mybucket-test-openwhisk',
        Key: key
    }

    const rs = s3.getObject(params).createReadStream();
    console.log('Read Stream: ', rs);
    return {
        msg: 'Hello World'
    }
}