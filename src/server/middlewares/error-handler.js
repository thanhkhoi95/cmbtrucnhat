(function () {

    module.exports = {
        errorHandler: errorHandler
    };

    function errorHandler(err, req, res, next) {
        if (err) {
            res.status(err.statusCode || 500).send({
                message: err.message
            });
        }
    }

})();