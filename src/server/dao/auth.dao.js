(function () {

    var adminConfig = require('../config/admin');
    var converter = require('../services/converter');
    var jwt = require('../services/jwt');
    var Deferred = require('deferred');

    module.exports = {
        validateAdmin: validateAdmin
    };

    function validateAdmin(admin) {
        var deferred = new Deferred();
        if (admin.username === adminConfig.username && admin.password === adminConfig.password) {
            admin.role = 'admin';
            jwt.sign(converter.userToResponseObject(admin), function (err, token) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve({
                        token: token
                    });
                }
            });
            return deferred.promise;
        } else {
            return Promise.reject({
                message: 'Invalid username or password',
                statusCode: 400
            });
        }
    }

})();