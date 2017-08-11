(function () {

    var jwt = require('./../services/jwt');

    exports.parser = function () {
        var role = Array.prototype.slice.call(arguments);
        return function (req, res, next) {
            var token = req.headers['x-access-token'];
            if (token) {
                jwt.verify(token, function (err, decodedData) {
                    if (err) {
                        res.status(401).json({
                            message: 'Invalid User or Token'
                        });
                    } else {
                        var user = decodedData.user;
                        if (decodedData.role === 'admin' && role.indexOf('admin') > -1) {
                            next();
                        } else {
                            res.status(550).json({
                                message: 'Permission denied'
                            });
                        }
                    }
                });
            } else {
                res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        };
    };

})();

