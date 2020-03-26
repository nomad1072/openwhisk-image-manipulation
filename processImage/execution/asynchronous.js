const request = require('request');
const jimp = require('jimp');

function fileRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                console.log('Get file API failed!');
                console.log('Error: ', error);
                resolve({ response: {}, body: {}, error: true });
            }
            resolve({ response: response, body: body, error: false });
        });
    });
}

module.exports.asynchronous = function(params) {

    return new Promise(async (resolve, reject) => {
        const key = params.KEY;
        let options = {
            method: 'GET', 
            url: `http://${params.OW_HOST}:3001/api/file`,
            qs: { 'app': 'serverless-image-process', 'path': 'images', 'fileName': key },
            headers: { 'Content-Type': 'application/json' },
            rejectUnauthorized: false,
            json: true
        };

        const getFileRequest = await fileRequest(options);
        if(getFileRequest.error) {
            console.log('Get file request failed');
            reject({ "msg": "invocation failed" });
        }

        const fileBuffer = new Buffer.from(getFileRequest.body.content);
        const image = await jimp.read(fileBuffer);
        const result = await image.resize(256, 256).grayscale().getBuffer('image/png', async function(err,buffer) {
            if(err) {
                return reject({ msg: 'Error in resizing the image '})
            }

            const options = {
                method: 'POST', 
                url: `http://${params.OW_HOST}:3001/api/file`,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    'app': 'serverless-image-process',
                    'path': 'thumbnails',
                    'fileName': key,
                    'content': buffer
                },
                rejectUnauthorized: false,
                json: true
            };

            const postFileRequest = await fileRequest(options);
            if(postFileRequest.error) {
                console.log('Post file request failed');
                reject({ "msg": "invocation failed" });
            }

            resolve({ "msg": 'Thumbnail created successfully '});
        });
    })
};