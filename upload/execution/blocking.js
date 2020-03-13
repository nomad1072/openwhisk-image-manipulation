const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

module.exports.blocking = function(params) {

    const s3 = new AWS.S3({ accessKeyId: params.AWS_ACCESS_KEY, secretAccessKey: params.AWS_SECRET });

    return new Promise((resolve, reject) => {
        const key = params.KEY;
        const rs = fs.createReadStream(path.join(__dirname, '../images', key));

        const uploadParams = {
            Bucket: params.BUCKET,
            Key: key,
            Body: rs
        }
        const uploadPromise = s3.upload(uploadParams).promise();
        uploadPromise.then((uploaded) => {
            console.log('Uplaoded: ', uploaded)
            var request = require("request");
            var rp = require("request-promise");
            var options = { 
                method: 'POST',
                url: `https://${params.OW_HOST}/api/v1/namespaces/_/actions/processImage`,
                qs: { blocking: 'true' },
                headers: { 'Content-Type': 'application/json' },
                body: { key: key },
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