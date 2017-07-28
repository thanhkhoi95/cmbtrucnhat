angular.module('app.auth')
    .config(authConfig);

function authConfig($stateProvider) {
    $stateProvider
        .state('auth', {
            url: '',
            templateUrl: 'app/components/auth/auth.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        });
}