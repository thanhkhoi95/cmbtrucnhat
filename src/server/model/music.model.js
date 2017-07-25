(function () {
    var mongoose = require('mongoose');
    var deepPopulate = require('mongoose-deep-poplate')(mongoose);
    mongoose.plugin(deepPopulate);
    var Schema = mongoose.Schema;

    var musicSchema = new Schema({
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artist'
        },
        musicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'musician'
        },
        name: {
            type: String,
            required: true
        },
        lyric: {
            type: String
        },
        uploadDate: {
            type: Date,
            required: true
        },
        plays: {
            type: Number,
            default: 0
        },
        downloads: {
            type: Number,
            default: 0
        }
    });

    var music = mongoose.model('music', musicSchema);

    module.exports = music;

})();