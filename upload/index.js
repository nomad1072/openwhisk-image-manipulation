const AWS = require('aws-sdk');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
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
            /*if (shell.exec(`/root/openwhisk-devtools/docker-compose/openwhisk-src/bin/wsk -i action invoke /whisk.system/processImage --result --param key ${key}`).code !== 0) {
                resolve({
                    msg: 'Image processed and uploaded'
                })
            } else {
                resolve({
                    msg: 'Image not processed'
                })
            } 
	    const ow = openwhisk();
  	    ow.actions.invoke({name: "processImage", blocking: true, result: true, params: { key: key } }).then((code) => { resolve({msg: 'action invoked'})}).catch((err) => { reject({msg: 'Failed'})})
            */
	    var request = require("request");

	    var options = { method: 'POST',
  		url: 'https://172.31.36.188/api/v1/namespaces/_/actions/processImage',
  		qs: { blocking: 'true' },
  		headers: { 'Content-Type': 'application/json' },
  		body: { key: '2.png' },
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

exports.main = test
