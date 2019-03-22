(function () {
    var router = require('express').Router();

    module.exports = function () {

        router.get('/', wakeUp);

        function wakeUp(req, res, next) {
            res.send('wake up');
        }

        return router;
    };

})();