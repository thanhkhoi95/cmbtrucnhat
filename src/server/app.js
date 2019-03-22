/*jshint node:true*/
'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var four0four = require('./utils/404')();
var genConfig = require('./config/general');
var port = process.env.PORT || genConfig.port;
var environment = process.env.NODE_ENV;
var errorHandler = require('./middlewares/error-handler').errorHandler;
var http = require('http');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

//app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(logger('dev'));

app.use('/api/trucnhat', require('./routes/trucnhat.route')());
app.use('/api/wake', require('./routes/wake.route')());

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function (req, res, next) {
            four0four.send404(req, res);
        });
        // Invalid calls to assets should return the custom error object to mitigate
        // against XSS reflected attacks
        app.use('/js/*', function (req, res, next) {
            four0four.send404(req, res);
        });
        app.use('/images/*', function (req, res, next) {
            four0four.send404(req, res);
        });
        app.use('/styles/*', function (req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function (req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.use(errorHandler);

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});

setInterval(function () {
    http.get('http://cmbtrucnhat.herokuapp.com/api/wake');
}, 300000);