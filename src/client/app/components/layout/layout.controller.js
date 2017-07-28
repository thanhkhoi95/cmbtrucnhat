angular.module('app.layout')
    .controller('layoutController', ['$state','authService', layoutController]);

function layoutController($state, authService) {
    var vm = this;
    vm.namePage = 'We listen - We feel the beat';
    vm.logout = logout;

    function logout() {
        toastr.success(authService.logout());
        $state.go('auth.login');
    }
}