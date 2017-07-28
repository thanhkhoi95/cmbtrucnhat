angular.module('app.register')
  .config(registerConfig);

function registerConfig($stateProvider) {
  $stateProvider
    .state('auth.register', {
      url: '/register',
      templateUrl: 'app/components/auth/register/register.html',
      controller: 'RegisterController',
      controllerAs: 'vm'
    });
}
