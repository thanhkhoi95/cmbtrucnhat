angular.module('app.login')
  .config(loginConfig);

function loginConfig($stateProvider) {
  $stateProvider
    .state('auth.login', {
      url: '/login',
      templateUrl: 'app/components/auth/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    });
}
