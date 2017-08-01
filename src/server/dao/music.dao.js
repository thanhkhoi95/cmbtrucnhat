(function () {
    var Music = require('../model/music.model');
    var Artist = require('../model/artist.model');
    var Musician = require('../model/musician.model');
    var genConf = require('../config/general');
    var pagination = require('../services/pagination');
    var converter = require('../services/converter');

    module.exports = {
        getById: getById,
        create: create,
        update: update,
        deleteById: deleteById,
        getAll: getAll,
        search: search,
        incPlays: incPlays,
        incDownloads: incDownloads
    };

    function incDownloads(musicId) {
        return Music.findOne({ _id: musicId }).then(
            /* Fulfilled */
            function (music) {
                if (!music) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Music not found!'
                        }
                    );
                }

                music.downloads += 1;

                return music.save().then(
                    /* Fulfilled */
                    function (resMusic) {
                        return Promise.resolve(
                            {
                                message: 'Increase downloads successfully'
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
            /* Catch error */
            function (err) {
                return Promise.reject(err);
            }
        );
    }

    function incPlays(musicId) {
        return Music.findOne({ _id: musicId }).then(
            /* Fulfilled */
            function (music) {
                if (!music) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Music not found!'
                        }
                    );
                }

                music.plays += 1;

                return music.save().then(
                    /* Fulfilled */
                    function (resMusic) {
                        return Promise.resolve(
                            {
                                message: 'Increase plays successfully'
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
            /* Catch error */
            function (err) {
                return Promise.reject(err);
            }
        );
    }

    function search(type, str, pageIndex, pageSize) {
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

        if (type === 'name') {
            Music.collection.dropIndex('lyric_text');
            Music.collection.createIndex({ name: 'text' });
            return Music.count({ $text: { $search: str } }).then(function (count) {
                return Music.find({ $text: { $search: str } })
                    .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                    .limit(pageSize)
                    .populate(['artistId', 'musicianId'])
                    .exec()
                    .then(
                    /* Fulfilled */
                    function (musics) {
                        var res = pagination.paging(musics, count, pageIndex, pageSize);
                        for (var i in res.items) {
                            res.items[i] = converter.musicToResponseObject(res.items[i]);
                        }
                        return Promise.resolve(res);
                    },
                    /* Catch error */
                    function (err) {
                        console.log(err);
                        return Promise.reject(err);
                    });
            });
        }

        if (type === 'lyric') {
            Music.collection.dropIndex('name_text');
            Music.collection.createIndex({ lyric: 'text' });
            return Music.count({ $text: { $search: str } }).then(function (count) {
                return Music.find({ $text: { $search: str } })
                    .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                    .limit(pageSize)
                    .populate(['artistId', 'musicianId'])
                    .exec()
                    .then(
                    /* Fulfilled */
                    function (musics) {
                        var res = pagination.paging(musics, count, pageIndex, pageSize);
                        for (var i in res.items) {
                            res.items[i] = converter.musicToResponseObject(res.items[i]);
                        }
                        return Promise.resolve(res);
                    },
                    /* Catch error */
                    function (err) {
                        console.log(err);
                        return Promise.reject(err);
                    });
            });
        }

        if (type === 'artist') {
            return Artist.find({ $text: { $search: str } }).then(
                function (artists) {
                    var idList = [];
                    for (var i in artists) {
                        idList.push(artists[i]._id);
                    }
                    return Music.count({ artistId: { $in: idList } }).then(function (count) {
                        return Music.find({ artistId: { $in: idList } })
                            .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                            .limit(pageSize)
                            .populate(['artistId', 'musicianId'])
                            .exec()
                            .then(
                            /* Fulfilled */
                            function (musics) {
                                var res = pagination.paging(musics, count, pageIndex, pageSize);
                                for (var i in res.items) {
                                    res.items[i] = converter.musicToResponseObject(res.items[i]);
                                }
                                return Promise.resolve(res);
                            },
                            /* Catch error */
                            function (err) {
                                return Promise.reject(err);
                            });
                    });
                },
                function (err) {
                    return Promise.reject({
                        message: err.message
                    });
                }
            );
        }

        if (type === 'musician') {
            return Musician.find({ $text: { $search: str } }).then(
                function (musicians) {
                    var idList = [];
                    for (var i in musicians) {
                        idList.push(musicians[i]._id);
                    }
                    return Musician.count({ musicianId: { $in: idList } }).then(function (count) {
                        return Music.find({ musicianId: { $in: idList } })
                            .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                            .limit(pageSize)
                            .populate(['artistId', 'musicianId'])
                            .exec()
                            .then(
                            /* Fulfilled */
                            function (musics) {
                                var res = pagination.paging(musics, count, pageIndex, pageSize);
                                for (var i in res.items) {
                                    res.items[i] = converter.musicToResponseObject(res.items[i]);
                                }
                                return Promise.resolve(res);
                            },
                            /* Catch error */
                            function (err) {
                                return Promise.reject(err);
                            });
                    });
                },
                function (err) {
                    return Promise.reject({
                        message: err.message
                    });
                }
            );
        }
    }

    function getById(musicId, origin) {
        return Music.findOne({ _id: musicId }).deepPopulate(['artistId', 'musicianId']).then(
            /* Fulfilled */
            function (music) {
                if (!music) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Music not found!'
                        }
                    );
                }
                return Promise.resolve({
                    music: origin ? music : converter.musicToResponseObject(music)
                });
            },
            /* Catch error */
            function (err) {
                return Promise.reject(err);
            }
        );
    }

    function getAll(pageIndex, pageSize, mode) {
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
        
        if (mode === 0) {
            return Music.count({}).exec().then(function (count) {
                return Music.find({}).sort({ uploadDate: -1})
                    .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                    .limit(pageSize)
                    .populate(['artistId', 'musicianId'])
                    .exec()
                    .then(
                    /* Fulfilled */
                    function (musics) {
                        var res = pagination.paging(musics, count, pageIndex, pageSize);
                        for (var i in res.items) {
                            res.items[i] = converter.musicToResponseObject(res.items[i]);
                        }
                        return Promise.resolve(res);
                    },
                    /* Catch error */
                    function (err) {
                        return Promise.reject(err);
                    });
            });
        } else if (mode === 1) {
            return Music.count({}).exec().then(function (count) {
                return Music.find({}).sort({ plays: -1})
                    .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                    .limit(pageSize)
                    .populate(['artistId', 'musicianId'])
                    .exec()
                    .then(
                    /* Fulfilled */
                    function (musics) {
                        var res = pagination.paging(musics, count, pageIndex, pageSize);
                        for (var i in res.items) {
                            res.items[i] = converter.musicToResponseObject(res.items[i]);
                        }
                        return Promise.resolve(res);
                    },
                    /* Catch error */
                    function (err) {
                        return Promise.reject(err);
                    });
            });
        }
    }

    function deleteById(musicId) {
        return Music.findOneAndRemove({
            _id: musicId
        }).then(
            function (music) {
                return Promise.resolve({
                    message: 'Music deleted',
                    fileId: music.fileId
                });
            },
            function (err) {
                if (err) {
                    return Promise.reject({
                        statusCode: 404,
                        message: failMessage.team.create.teamNotFound
                    });
                }
            }
            );
    }

    function update(musicInfo) {
        return Music.findOne({ _id: musicInfo._id }).then(
            /* Fulfilled */
            function (music) {
                if (!music) {
                    return Promise.reject(
                        {
                            statusCode: 400,
                            message: 'Music not found!'
                        }
                    );
                }
                music.name = musicInfo.name || music.name;
                music.artistId = musicInfo.artistId || undefined;
                music.musicianId = musicInfo.musicianId || undefined;
                music.lyric = musicInfo.lyric || "Không có";

                return music.save().then(
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