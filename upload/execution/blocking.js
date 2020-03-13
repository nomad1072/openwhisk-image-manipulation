const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

module.exports.blocking = function(params) {

    const s3 = new AWS.S3({ accessKeyId: params.AWS_ACCESS_KEY, secretAccessKey: params.AWS_SECRET });

    return new Promise((resolve, reject) => {
        const key = params.KEY;
	console.log('__DIRNAME: ', __dirname);
        const rs = fs.createReadStream(path.join(__dirname, '../images', key));
        console.log('RS: ', rs);
        const uploadParams = {
            Bucket: params.BUCKET,
            Key: key,
            Body: rs
        }
        const uploadPromise = s3.upload(uploadParams).promise();
        console.log('upload promise: ', uploadPromise);
        uploadPromise.then((uploaded) => {
            console.log('Uplaoded: ', uploaded)
            var request = require("request");
            console.log('HOST: ', params.OW_HOST);
            var options = { 
                method: 'POST',
                url: `https://${params.OW_HOST}/api/v1/namespaces/_/actions/processImage`,
                qs: { blocking: 'true' },
                headers: { 'Content-Type': 'application/json' },
                body: { 
                    KEY: key,
                    AWS_ACCESS_KEY: params.AWS_ACCESS_KEY,
                    AWS_SECRET: params.AWS_SECRET,
                    BUCKET: params.BUCKET 
                },
                rejectUnauthorized: false,
                json: true,
                auth: {
                    user: params.OW_AUTH_USER,
                    pass: params.OW_AUTH_PASS
                }	
            };
            request(options, function (error, response, body) {
                if (error) { reject({"msg": "Failed", err: error}) };
                console.log(body);
                resolve({"msg": "invoked successfully", body: body})
            });
    }).catch((err) => {
            reject({
                msg: 'Image processing failed'
            })
        })
    })
}
