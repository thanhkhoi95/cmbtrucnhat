(function () {

    var Artist = require('../model/artist.model');
    var genConf = require('../config/general');
    var pagination = require('../services/pagination')

    module.exports = {
        getById: getById,
        create: create,
        getAll: getAll
    };

    function getById(ArtistId) {
        return Artist.findOne({ _id: ArtistId }).then(
            /* Fulfilled */
            function (artist) {
                return Promise.resolve({
                    artist: artist
                });
            },
            /* Catch error */
            function (err) {
                return Promise.reject(err);
            }
        );
    }

    function create(artist) {
        var NewArtist = new Artist(artist);
        return NewArtist.save().then(
            /* Fulfilled */
            function (newArtist) {
                return Promise.resolve({
                    newArtist: newArtist
                });
            },
            /* Catch error */
            function (err) {
                return Promise.reject(err);
            }
        );
    }

    function getAll(pageIndex, pageSize) {
        if (!pageIndex || pageIndex < 1) {
            pageIndex = 1;
        }
        if (!pageSize || pageSize < 1) {
            pageSize = genConf.pageSize;
        }

        return Artist.count({}).then(function (count) {
            return Artist.find({})
                .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                .limit(pageSize).exec()
                .then(
                /* Fulfilled */
                function (artists) {
                    var res = pagination.paging(artists, count, pageIndex, pageSize);
                    return Promise.resolve(res);
                },
                /* Catch error */
                function (err) {
                    return Promise.reject(err);
                });
        });
    }

})();