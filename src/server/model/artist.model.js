(function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var artistSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        detailInformation: {
            type: String
        },
        birthdate: {
            type: Date
        }
    });

    artistSchema.pre('remove', function (next) {
        this.model('music').update(
            {artistId: this._id},
            {artistId: undefined},
            {multi: true},
            next
        );
    });

    artistSchema.index({name: 'text'});

    var artist = mongoose.model('artist', artistSchema);

    module.exports = artist;

})();