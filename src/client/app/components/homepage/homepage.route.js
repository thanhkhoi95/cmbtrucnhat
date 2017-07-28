angular.module('app.homepage')
    .config(loginConfig);

function loginConfig($stateProvider) {
    $stateProvider
        .state('layout.homepage', {
            url: '/homepage',
            templateUrl: 'app/components/homepage/homepage.html',
            controller: 'HomePageController',
            controllerAs: 'vm'
        });
}