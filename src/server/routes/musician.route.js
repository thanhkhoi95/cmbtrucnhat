(function () {

    var router = require('express').Router();
    var musicianDao = require('../dao/musician.dao');
    var auth = require('../middlewares/jwt-parser');

    module.exports = function () {

        router.get('/', getAllMusician);
        router.get('/:id', getMusicianById);
        router.post('/', auth.parser('admin'), createMusician);
        router.put('/:id', auth.parser('admin'), updateMusicianById);
        // router.delete('/:id', auth.parser('admin'), deleteArtistById);

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

        function updateMusicianById(req, res, next) {
            var musicianInfo = req.body;
            musicianInfo._id = req.params.id;
            musicianDao.updateById(musicianInfo).then(
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

        function deleteArtistById() {

        }

        return router;
    };

})();