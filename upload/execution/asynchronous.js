const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports.asynchronous = function(params) {
    
    return new Promise(async (resolve, reject) => {
        const key = params.KEY;
        const fileBuffer = fs.readFileSync(path.join(__dirname, '../images', key));

        const options = {
            method: 'POST', 
            url: `http://${params.OW_HOST}:3001/api/file`,
            headers: { 'Content-Type': 'application/json' },
            body: {
                'app': 'serverless-image-process',
                'path': 'images',
                'fileName': key,
                'content': fileBuffer
            },
            rejectUnauthorized: false,
            json: true
        };

        request(options, function(error, response, body) {
            if(error) {
                reject({ "msg": "Failed", err: error })
            }
            resolve({ "msg": "invoked successfully ", body: body });
        });
    }); 
}