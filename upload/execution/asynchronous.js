const fs = require('fs');
const path = require('path');

module.exports.asynchronous = function(params) {
    
    const key = params.KEY;
    const rs = fs.createReadStream(path.join(__dirname, '../images', key));
    const ws = fs.createWriteStream(path.join("/tmp", '/images', key));

    rs.on("end", function() {
        resolve({ msg: "Image piped successfully to directory "});
    });
    rs.on("errror", function() {
        reject({ msg: "Failed to pipe image to directory "});
    })
    rs.pipe(ws);
}