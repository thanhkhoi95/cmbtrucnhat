(function () {

    var router = require('express').Router();
    var musicDao = require('../dao/music.dao');
    var auth = require('../middlewares/jwt-parser');
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    var fs = require('fs');

    module.exports = function () {

        // router.get('/', getAllMusic);
        // router.get('/:id', getMusicById);
        router.post('/create', auth.parser('admin'), multipartMiddleware, uploadMusic);
        router.get('/play', streamMusic);
        router.all('/download', downloadMusic);
        router.put('/:id', auth.parser('admin'), updateArtistById);
        router.delete('/:id', auth.parser('admin'), deleteArtistById);

        function downloadMusic(req, res, next) {
            var musicId = req.query.id;
            var music;
            musicDao.getById(musicId).then(
                /* Fulfilled */
                function (response) {
                    music = response;
                },
                /* Catch errors */
                function (err) {
                    next(err);
                }
            );
            var file = __dirname + '/../upload/' + music.fileId;
            var fileId = encodeURI(music.name);
            fs.exists(file, function (exists) {
                if (exists) {
                    res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
                    res.setHeader('Content-Type', 'application/audio/mpeg3');
                    var rstream = fs.createReadStream(file);
                    rstream.pipe(res);
                } else {
                    next({
                        statusCode: 404,
                        message: 'File not found!'
                    });
                }
            });
        }

        function streamMusic(req, res, next) {
            var musicId = req.query.id;
            var flag = true;
            musicDao.getById(musicId).then(
                /* Fulfilled */
                function (response) {
                    var music = response.music;
                    var file = __dirname + '/../upload/' + music.fileId;
                    console.log(music);
                    console.log(file);
                    fs.exists(file, function (exists) {
                        if (exists) {
                            var stat = fs.statSync(file);
                            var total = stat.size;
                            if (req.headers.range) {
                                var range = req.headers.range;
                                var parts = range.replace(/bytes=/, '').split('-');
                                var partialstart = parts[0];
                                var partialend = parts[1];

                                var start = parseInt(partialstart, 10);
                                var end = partialend ? parseInt(partialend, 10) : total - 1;
                                var chunksize = (end - start) + 1;
                                var readStream = fs.createReadStream(file, { start: start, end: end, autoClose: true });
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
                                fs.createReadStream(file).pipe(res);
                            }
                        } else {
                            next({
                                statusCode: 404,
                                message: 'File not found!'
                            });
                        }
                    });
                },
                /* Catch errors */
                function (err) {
                    flag = false;
                    console.log(err);
                    next(err);
                }
            );

        }

        function uploadMusic(req, res, next) {
            console.log(req.body, req.files);
            var file;

            if (req.files.music) {
                file = req.files.music;
                if (file.type !== 'audio/mp3' && file.type !== 'audio/mpeg') {
                    next(
                        {
                            statusCode: 400,
                            message: 'File\'s type mismatch!'
                        }
                    );
                    return;
                }
            } else {
                next(
                    {
                        statusCode: 400,
                        message: 'File does not exist!'
                    }
                );
                return;
            }

            var fileId = Date.now() + '.mp3';

            var pathUpload = __dirname + '/../upload/' + fileId;

            fs.readFile(file.path, function (err, data) {
                if (!err) {
                    fs.writeFile(pathUpload, data, function (err) {
                        if (!err) {
                            req.body.fileId = fileId;
                            req.body.uploadDate = new Date().getDate();
                            musicDao.create(req.body).then(
                                /* Fulfilled */
                                function (response) {
                                    res.send(response);
                                },
                                /* Catch erros */
                                function (error) {
                                    fs.unlink(pathUpload);
                                    next(error);
                                }
                            );
                        } else {
                            next({
                                message: 'Create new music error!'
                            });
                        }
                    });
                } else {
                    next({
                        message: 'Create new music error!'
                    });
                }
            });

            for (var f in req.files) {
                if (f) {
                    fs.unlink(req.files[f].path);
                }
            }
        }

        return router;
    };

})();