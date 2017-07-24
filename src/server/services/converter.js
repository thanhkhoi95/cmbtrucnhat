(function () {

    module.exports = {
        userToResponseObject: userToResponseObject
    };

    function userToResponseObject(user){
        var userObject = user;
        delete userObject.password;
        delete userObject.salt;
        return userObject;
    }

})();