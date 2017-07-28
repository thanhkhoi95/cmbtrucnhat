(function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var musicianSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        birthdate: {
            type: Date
        },
        detailInformation: {
            type: String
        }
    });

    musicianSchema.pre('remove', function (next) {
        this.model('music').update(
            {artistId: this._id},
            {artistId: undefined},
            {multi: true},
            next
        );
    });

    musicianSchema.index({name: 'text'});

    var musician = mongoose.model('musician', musicianSchema);

    module.exports = musician;

})();