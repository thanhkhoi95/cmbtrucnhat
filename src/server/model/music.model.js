(function () {
    var mongoose = require('mongoose');
    var deepPopulate = require('mongoose-deep-populate')(mongoose);
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
        lowerCaseName: {
            type: String
        },
        fileId: {
            type: String,
            required: true
        },
        lyric: {
            type: String,
            default: 'Not available'
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

    musicSchema.pre('save', function(next){
        this.lowerCaseName = this.name.toLowerCase();
        next();
    });

    var music = mongoose.model('music', musicSchema);

    module.exports = music;

})();