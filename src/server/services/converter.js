(function () {

    module.exports = {
        userToResponseObject: userToResponseObject,
        musicToResponseObject: musicToResponseObject
    };

    function userToResponseObject(user) {
        var userObject = user;
        delete userObject.password;
        delete userObject.salt;
        return userObject;
    }

    function musicToResponseObject(music) {
        var musicObject = {};
        musicObject._id = music._id;
        musicObject.name = music.name;
        musicObject.uploadDate = music.uploadDate;
        musicObject.plays = music.plays;
        musicObject.downloads = music.downloads;
        musicObject.lyric = music.lyric;
        if (music.artistId) {
            musicObject.artist = music.artistId;
        }
        if (music.musicianId) {
            musicObject.musician = music.musicianId;
        }
        return musicObject;
    }

})();