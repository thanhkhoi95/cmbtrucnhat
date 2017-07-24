(function () {

    var router = require('express').Router();
    var adminConfig = require('../config/admin');
    var authDao = require('../dao/auth.dao');

    module.exports = function () {

        router.post(adminConfig.adminPageUrl, adminLogin);

        function adminLogin(req, res, next) {
            var admin = {
                username: req.body.username,
                password: req.body.password
            };
            authDao.validateAdmin(admin).then(
                /* Fulfilled */
                function (response) {
                    res.send(response);
                },
                /* Catch Error */
                function (error) {
                    next(error);
                }
            );
        }

        return router;
    };

})();