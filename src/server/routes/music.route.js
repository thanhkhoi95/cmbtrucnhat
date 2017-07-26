(function () {
    var router = require('express').Router();
    var artistDao = require('../dao/artist.dao');
    var auth = require('../middlewares/jwt-parser');
    var uploadSingle = require('../middlewares/file-upload').uploadSingle;

    module.exports = function () {

        router.post('/upload', auth.parser('admin'), uploadSingle, uploadMusic);
        // router.get('/', getAllArtist);
        // router.get('/:id', getArtistById);
        // router.post('/', auth.parser('admin'), createArtist);
        // router.put('/:id', auth.parser('admin'), updateArtistById);
        // router.delete('/:id', auth.parser('admin'), deleteArtistById);

        function uploadMusic(req, res, next) {
            res.send({
                musicUrl: req.musicUrl
            });
        }

        // function getAllArtist(req, res, next) {
        //     var pageIndex = req.query.pageIndex;
        //     var pageSize = req.query.pageSize;
        //     artistDao.getAll(pageIndex, pageSize).then(
        //         /* Fulfilled */
        //         function (response) {
        //             res.send(response);
        //         },
        //         /* Catch error */
        //         function (error) {
        //             next(error);
        //         }
        //     );
        // }

        // function getArtistById(req, res, next) {
        //     var artistId = req.params.id;
        //     artistDao.getById(artistId).then(
        //         function (response) {
        //             res.send(response);
        //         },
        //         function (error) {
        //             next(error);
        //         }
        //     );
        // }

        // function createArtist(req, res, next) {
        //     var artist = {};
        //     artist.name = req.body.name;
        //     if (req.body.detailInformation) {
        //         artist.detailInformation = req.body.detailInformation;
        //     }
        //     if (req.body.birthdate) {
        //         artist.birthdate = req.body.birthdate;
        //     }
        //     artistDao.create(artist).then(
        //         /* Fulfilled */
        //         function (response) {
        //             res.send(response);
        //         },
        //         /* Catch error */
        //         function (error) {
        //             next(error);
        //         }
        //     );
        // }

        // function updateArtistById(req, res, next) {
        //     var artistInfo = req.body;
        //     artistInfo._id = req.params.id;
        //     artistDao.updateById(artistInfo).then(
        //         /* Fulfilled */
        //         function (response) {
        //             res.send(response);
        //         },
        //         /* Catch error */
        //         function (error) {
        //             next(error);
        //         }
        //     );
        // }

        // function deleteArtistById() {

        // }

        return router;
    };

})();