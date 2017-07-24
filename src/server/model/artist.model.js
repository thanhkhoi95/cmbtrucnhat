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

    var artist = mongoose.model('artist', artistSchema);

    module.exports = artist;

})();