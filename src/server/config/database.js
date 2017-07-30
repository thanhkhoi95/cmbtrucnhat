(function () {

    var mongoose = require('mongoose');

    module.exports = {
        connect: connect,
        disconnect: disconnect
    };

    var db = {
        host: 'localhost:27017',
        database: 'welife',
        user: '',
        password: '',
    };

    function connect() {
        console.log('Connecting to database...');
        mongoose.connect(conStrBuild(), {
            useMongoClient: true,
            /* other options */
        }).then(
            function () {
                console.log('Successfully connect to database!');
            },
            function () {
                console.log('Unable to connect to database!');
                console.log('Trying to reconnect after 5s...');
                console.log(conStrBuild());
                setTimeout(connect, 5000);
            }
        );
    }

    function disconnect() {
        mongoose.disconnect().then(
            function () {
                console.log('Database disconnected!');
            },
            function (err) {
                console.log('Fail to disconnect database!\n' + err.message);
            }
        );
    }

    function conStrBuild() {
        var conStr = db.host + '/' + db.database;
        conStr = (db.password === '' ? '' : db.password + '@') + conStr;
        conStr = (db.user === '' ? '' : db.user + ':') + conStr;
        return 'mongodb://' + conStr;
    }

})();