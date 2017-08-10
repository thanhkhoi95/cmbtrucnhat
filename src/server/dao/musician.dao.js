(function () {

    var Musician = require('../model/musician.model');
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
                    musicianId: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$musicianId',
                    plays: { $sum: '$plays' }
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
                return Musician.populate(data, { path: '_id' }).then(
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

    function deleteById(musicianId) {
        return Musician.findOne({ _id: musicianId }).then(
            function (musician) {
                return musician.remove().then(
                    function () {
                        return Promise.resolve(
                            {
                                message: 'Musician deleted'
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

    function getById(musicianId) {
        return Musician.findOne({ _id: musicianId }).then(
            /* Fulfilled */
            function (musician) {
                if (!musician) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Musician not found'
                        }
                    );
                }
                return Promise.resolve({
                    musician: musician
                });
            },
            /* Catch error */
            function (err) {
                return Promise.reject(err);
            }
        );
    }

    function create(musician) {
        var NewMusician = new Musician(musician);
        return NewMusician.save().then(
            /* Fulfilled */
            function (newMusician) {
                return Promise.resolve({
                    newMusician: newMusician
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

        return Musician.count({}).then(function (count) {
            return Musician.find({})
                .sort({ lowerCaseName: 1 })
                .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                .limit(pageSize).exec()
                .then(
                /* Fulfilled */
                function (musicians) {
                    var res = pagination.paging(musicians, count, pageIndex, pageSize);
                    return Promise.resolve(res);
                },
                /* Catch error */
                function (err) {
                    return Promise.reject(err);
                });
        });
    }

    function update(musicianInfo) {
        return Musician.findOne({ _id: musicianInfo._id }).then(
            /* Fulfilled */
            function (musician) {
                if (!musician) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Musician not found'
                        }
                    );
                }
                musician.name = musicianInfo.name || musician.name;
                musician.detailInformation = musicianInfo.detailInformation || musician.detailInformation;
                musician.birthdate = musicianInfo.birthdate || musician.birthdate;
                return musician.save().then(
                    /* Fulfilled */
                    function (updatedMusician) {
                        return Promise.resolve(
                            {
                                composer: updatedMusician
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