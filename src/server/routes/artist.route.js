(function () {

    var router = require('express').Router();
    var artistDao = require('../dao/artist.dao');
    var auth = require('../middlewares/jwt-parser');

    module.exports = function () {

        router.get('/', getAllArtist);
        router.get('/:id', getArtistById);
        router.post('/', auth.parser('admin'), createArtist);
        router.put('/', auth.parser('admin'), updateArtist);
        router.delete('/:id', auth.parser('admin'), deleteArtistById);
        router.post('/search', searchArtist);

        function searchArtist(req, res, next) {
            var pageIndex = req.query.pageIndex;
            var pageSize = req.query.pageSize;
            var str = req.body.searchString;
            artistDao.search(pageIndex, pageSize, str).then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    next(error);
                }
            );
        }

        function deleteArtistById(req, res, next) {
            var artistId = req.params.id;
            artistDao.deleteById(artistId).then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    next(error);
                }
            );
        }

        function getAllArtist(req, res, next) {
            var pageIndex = req.query.pageIndex;
            var pageSize = req.query.pageSize;
            artistDao.getAll(pageIndex, pageSize).then(
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

        function getArtistById(req, res, next) {
            var artistId = req.params.id;
            artistDao.getById(artistId).then(
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

        function createArtist(req, res, next) {
            var artist = {};
            artist.name = req.body.name;
            if (req.body.detailInformation) {
                artist.detailInformation = req.body.detailInformation;
            }
            if (req.body.birthdate) {
                artist.birthdate = req.body.birthdate;
            }
            artistDao.create(artist).then(
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

        function updateArtist(req, res, next) {
            var artistInfo = req.body;
            artistDao.update(artistInfo).then(
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