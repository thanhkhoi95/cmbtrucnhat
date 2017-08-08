(function () {

    var Musician = require('../model/musician.model');
    var genConf = require('../config/general');
    var pagination = require('../services/pagination');

    module.exports = {
        getById: getById,
        create: create,
        getAll: getAll,
        update: update,
        deleteById: deleteById
    };

    function deleteById(musicianId) {
        return Musician.remove({ _id: musicianId }).then(
            function () {
                return Promise.resolve(
                    {
                        message: "Musician deleted"
                    }
                );
            },
            function (err) {
                return Promise.resolve(
                    {
                        message: err.message
                    }
                );
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
                                artist: updatedMusician
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