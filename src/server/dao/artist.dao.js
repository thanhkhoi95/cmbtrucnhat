(function () {

    var Artist = require('../model/artist.model');
    var Music = require('../model/music.model');
    var genConf = require('../config/general');
    var pagination = require('../services/pagination');
    var converter = require('../services/converter');

    module.exports = {
        getById: getById,
        create: create,
        getAll: getAll,
        update: update,
        deleteById: deleteById,
        search: search,
        getTop: getTop
    };

    function getTop(pageIndex, pageSize) {
        if (!pageIndex || pageIndex < 1) {
            pageIndex = 1;
        } else {
            pageIndex = parseInt(pageIndex);
        }
        if (!pageSize || pageSize < 1) {
            pageSize = genConf.pageSize;
        } else {
            pageSize = parseInt(pageSize);
        }
        var agg = [
            {
                $match: {
                    artistId: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$artistId",
                    plays: { $sum: "$plays" }
                }
            },
            {
                $sort: {
                    plays: -1
                }
            }
        ];

        return Music.aggregate(agg).then(
            function (data) {
                return Artist.populate(data, { path: '_id' }).then(
                    function (data) {
                        var count = data.length;
                        if ((pageIndex - 1) * pageSize <= count){
                            data.splice(0, (pageIndex - 1) * pageSize);
                            if (data.length > pageSize) {
                                data.splice(pageSize, data.length - pageSize);
                            }
                        } else {
                            data = [];
                        }
                        var res = pagination.paging(data, count, pageIndex, pageSize);
                        for (var i in res.items) {
                            if (res.items[i]) {
                                res.items[i] = converter.statisticObjectToResponseObject(res.items[i]);
                            }
                        }
                        console.log(res);
                        return Promise.resolve(res);
                    },
                    function (err) {
                        console.log(err);
                        return Promise.reject(err);
                    }
                );
            },
            function (err) {
                console.log(err);
                return Promise.reject(err);
            }
        );
    }

    function search(pageIndex, pageSize, str) {
        if (!pageIndex || pageIndex < 1) {
            pageIndex = 1;
        } else {
            pageIndex = parseInt(pageIndex);
        }
        if (!pageSize || pageSize < 1) {
            pageSize = genConf.pageSize;
        } else {
            pageSize = parseInt(pageSize);
        }

        return Artist.count({ $text: { $search: str } }).then(function (count) {
            return Artist.find({ $text: { $search: str } })
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

    function deleteById(artistId) {
        return Artist.findOne({ _id: artistId }).then(
            function (artist) {
                return artist.remove().then(
                    function () {
                        return Promise.resolve(
                            {
                                message: 'Artist deleted'
                            }
                        );
                    },
                    function (err) {
                        console.log(err);
                        return Promise.resolve(
                            {
                                message: err.message
                            }
                        );
                    }
                );
            },
            function (err) {
                console.log(err);
            }
        );

    }

    function getById(artistId) {
        return Artist.findOne({ _id: artistId }).then(
            /* Fulfilled */
            function (artist) {
                if (!artist) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Artist not found'
                        }
                    );
                }
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
        } else {
            pageIndex = parseInt(pageIndex);
        }
        if (!pageSize || pageSize < 1) {
            pageSize = genConf.pageSize;
        } else {
            pageSize = parseInt(pageSize);
        }

        return Artist.count({}).then(function (count) {
            return Artist.find({})
                .sort({ lowerCaseName: 1 })
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

    function update(artistInfo) {
        return Artist.findOne({ _id: artistInfo._id }).then(
            /* Fulfilled */
            function (artist) {
                if (!artist) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Artist not found'
                        }
                    );
                }
                artist.name = artistInfo.name || artist.name;
                artist.detailInformation = artistInfo.detailInformation || artist.detailInformation;
                artist.birthdate = artistInfo.birthdate || artist.birthdate;
                return artist.save().then(
                    /* Fulfilled */
                    function (updatedArtist) {
                        return Promise.resolve(
                            {
                                artist: updatedArtist
                            }
                        );
                    },
                    /* Catch error */
                    function (err) {
                        return Promise.reject(err);
                    }
                );
            },
            /* Catch error */
            function (err) {
                return Promise.reject(err);
            }
        );
    }
})();