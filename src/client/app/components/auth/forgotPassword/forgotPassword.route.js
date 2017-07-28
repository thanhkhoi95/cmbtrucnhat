angular.module('app.forgotPassword')
  .config(forgotPasswordConfig);

function forgotPasswordConfig($stateProvider) {
  $stateProvider
    .state('auth.forgotPassword', {
      url: '/forgotPassword',
      templateUrl: 'app/components/auth/forgotPassword/forgotPassword.html',
      controller: 'forgotPasswordController',
      controllerAs: 'vm'
    })
    .state('auth.resetPassword', {
      url: '/resetPassword/:token',
      templateUrl: 'app/components/auth/forgotPassword/resetPassword.html',
      controller: 'forgotPasswordController',
      controllerAs: 'vm'
    });
}
