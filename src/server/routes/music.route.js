(function () {

    var router = require('express').Router();
    var artistDao = require('../dao/artist.dao');
    var auth = require('../middlewares/jwt-parser');
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    module.exports = function () {

        // router.get('/', getAllMusic);
        // router.get('/:id', getMusicById);
        router.post('/upload', multipartMiddleware, uploadMusic);
        router.get('/play', streamMusic);
        router.all('/download', downloadMusic);
        // router.put('/:id', auth.parser('admin'), updateArtistById);
        // router.delete('/:id', auth.parser('admin'), deleteArtistById);

        function downloadMusic(req, res, next) {
            var fileId = req.query.id;
            var file = __dirname + '/music/' + fileId;
            fileId = encodeURI(fileId);
            fs.exists(file, function (exists) {
                if (exists) {
                    res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
                    res.setHeader('Content-Type', 'application/audio/mpeg3');
                    var rstream = fs.createReadStream(file);
                    rstream.pipe(res);
                } else {
                    res.send("Its a 404");
                    res.end();
                }
            });
        }

        function streamMusic(req, res, next) {
            var fileId = req.query.id;
            var filePath = __dirname + '/upload/' + fileId;
            var stat = fs.statSync(filePath);
            var total = stat.size;
            if (req.headers.range) {
                var range = req.headers.range;
                var parts = range.replace(/bytes=/, "").split("-");
                var partialstart = parts[0];
                var partialend = parts[1];

                var start = parseInt(partialstart, 10);
                var end = partialend ? parseInt(partialend, 10) : total - 1;
                var chunksize = (end - start) + 1;
                var readStream = fs.createReadStream(filePath, { start: start, end: end, autoClose: true });
                var maxChunk = 1024 * 1024; // 1MB at a time
                if (chunksize > maxChunk) {
                    end = start + maxChunk - 1;
                    chunksize = (end - start) + 1;
                }
                res.writeHead(206, {
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                    'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
                    'Content-Type': 'audio/mpeg'
                });
                readStream.pipe(res);
            } else {
                if (total >= 1048576) {
                    res.writeHead(206, {
                        'Content-Range': 'bytes ' + 0 + '-' + 1048576 + '/' + total,
                        'Accept-Ranges': 'bytes', 'Content-Length': 1048576,
                        'Content-Type': 'audio/mpeg'
                    });
                } else {
                    res.writeHead(206, {
                        'Content-Length': total,
                        'Content-Type': 'audio/mpeg'
                    });
                }
                readStream.pipe(res);
            }
        }

        function uploadMusic(req, res, next) {
            console.log(req.body, req.files);
            res.end();
        }
    }

})();