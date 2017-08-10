(function () {

    var router = require('express').Router();
    var musicianDao = require('../dao/musician.dao');
    var auth = require('../middlewares/jwt-parser');

    module.exports = function () {

        router.get('/', getAllMusician);
        router.get('/:id', getMusicianById);
        router.get('/top', getTopMusician);
        router.post('/', auth.parser('admin'), createMusician);
        router.put('/', auth.parser('admin'), updateMusician);
        router.delete('/:id', auth.parser('admin'), deleteMusicianById);
        router.post('/search', searchMusician);

        function getTopMusician(req, res, next) {
            var pageIndex = req.query.pageIndex;
            var pageSize = req.query.pageSize;
            musicianDao.getTop(pageIndex, pageSize).then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    next(error);
                }
            );
        }

        function searchMusician(req, res, next) {
            var pageIndex = req.query.pageIndex;
            var pageSize = req.query.pageSize;
            var str = req.body.searchString;
            musicianDao.search(pageIndex, pageSize, str).then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    next(error);
                }
            );
        }

        function deleteMusicianById(req, res, next) {
            var musicianId = req.params.id;
            musicianDao.deleteById(musicianId).then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    next(error);
                }
            );
        }

        function getAllMusician(req, res, next) {
            var pageIndex = req.query.pageIndex;
            var pageSize = req.query.pageSize;
            musicianDao.getAll(pageIndex, pageSize).then(
                /* Fulfilled */
                function (response) {
                    res.send(response);
                },
                /* Catch error */
                function (error) {
                    next(error);
                }
            );
        }

        function getMusicianById(req, res, next) {
            var artistId = req.params.id;
            musicianDao.getById(artistId).then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    next(error);
                }
            );
        }

        function createMusician(req, res, next) {
            var artist = {};
            artist.name = req.body.name;
            if (req.body.detailInformation) {
                artist.detailInformation = req.body.detailInformation;
            }
            if (req.body.birthdate) {
                artist.birthdate = req.body.birthdate;
            }
            musicianDao.create(artist).then(
                /* Fulfilled */
                function (response) {
                    res.send(response);
                },
                /* Catch error */
                function (error) {
                    next(error);
                }
            );
        }

        function updateMusician(req, res, next) {
            var musicianInfo = req.body;
            musicianDao.update(musicianInfo).then(
                /* Fulfilled */
                function (response) {
                    res.send(response);
                },
                /* Catch error */
                function (error) {
                    next(error);
                }
            );
        }

        return router;
    };

})();