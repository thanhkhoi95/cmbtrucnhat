'use strict';
angular.module('app.auth')
    .controller('AuthController', ['$state', 'authService', AuthController]);

function AuthController($state, authService) {
    var vm = this;
}