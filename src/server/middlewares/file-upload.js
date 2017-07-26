/*jshint esversion: 6*/
const profileImgPathUrl = '/upload/';
var multer = require('multer');

module.exports = {
    uploadSingle: uploadSingle
};

function uploadSingle(req, res, next) {
    console.log(req);
    var imgUrl = profileImgPathUrl;
    var mime = ['audio/mp3'];
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './upload');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    var upload = multer({
        storage: storage
    }).single('music');

    upload(req, res, function (err) {
        if (!req.file) {
            return res.status(403).send('File not found!');
        }

        if (mime.indexOf(req.file.mimetype) === -1) {
            return res.status(403).send('Not mp3 format!');
        }

        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }
        req.musicUrl = imgUrl + '/' + req.file.filename;
        next();
    });
}
