angular.module('app.admin')
    .config(profileConfig);

function profileConfig($stateProvider) {
    $stateProvider
        .state('layout.admin', {
            url: '/admin',
            templateUrl: 'app/components/admin/admin.html',
            controller: 'adminController',
            controllerAs: 'vm'
        });
}