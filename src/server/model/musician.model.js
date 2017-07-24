(function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var musicianSchema = new Schema({
        ten: {
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

    var musician = mongoose.model('musician', musicianSchema);

    module.exports = musician;

})();