(function () {
    var Music = require('../model/music.model');
    var genConf = require('../config/general');
    var pagination = require('../services/pagination');
    var converter = require('../services/converter');

    module.exports = {
        getById: getById,
        create: create,
        updateById: updateById
    };

    function getById(musicId) {
        return Music.findOne({ _id: musicId }).deepPopulate(['artistId', 'musicianId']).then(
            /* Fulfilled */
            function (music) {
                if (!music) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Music not found'
                        }
                    );
                }
                return Promise.resolve(
                    {
                        music: converter.musicToResponseObject(music)
                    }
                );
            },
            /* Catch error */
            function (err) {
                return Promise.reject(err);
            }
        );
    }

    function create(music) {
        var newMusic = new Music(music);
        return newMusic.save().then(
            /* Fulfilled */
            function (resMusic) {
                resMusic = new Music(resMusic);
                return resMusic.deepPopulate(['musicianId', 'artistId']).then(
                    /* Fulfilled */
                    function (data) {
                        return Promise.resolve(
                            {
                                music: converter.musicToResponseObject(data)
                            }
                        );
                    },
                    /* Catch errors */
                    function (err) {
                        return Promise.reject(
                            {
                                message: err.message
                            }
                        );
                    }
                );
            },
            /* Catch errors */
            function (err) {
                return Promise.reject(
                    {
                        message: err.message
                    }
                );
            }
        );
    }
})();