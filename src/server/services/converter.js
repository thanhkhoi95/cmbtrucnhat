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
        var musicObject = music.toObject();

        delete musicObject.fileId;

        if (musicObject.artistId) {
            musicObject.artist = musicObject.artistId;
        }
        if (musicObject.musicianId) {
            musicObject.musician = musicObject.musicianId;
        }

        delete musicObject.musicianId;
        delete musicObject.artistId;

        return musicObject;
    }

})();