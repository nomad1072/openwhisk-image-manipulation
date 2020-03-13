module.exports.asynchronous = function(params) {
    return new Promise((resolve, reject) => {
        const key = params.key;
        const rs = fs.createReadStream(path.join(__dirname, 'images', KEY));

        const uploadParams = {
            Bucket: 'mybucket-test-openwhisk',
            Key: key,
            Body: rs
        }
        const uploadPromise = s3.upload(uploadParams).promise();
        uploadPromise.then((uploaded) => {
            console.log('Uplaoded: ', uploaded)
            var request = require("request");
            var options = { 
                method: 'POST',
                url: 'https://172.31.36.188/api/v1/namespaces/_/actions/processImage',
                qs: { blocking: 'true' },
                headers: { 'Content-Type': 'application/json' },
                body: { key: key },
                rejectUnauthorized: false,
                json: true,
                auth: {
                    user: '789c46b1-71f6-4ed5-8c54-816aa4f8c502',
                    pass: 'abczO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP'
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