'use strict';
angular.module('app.login')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$state', 'authService'];

function LoginController($scope, $state, authService) {
    var vm = this;
    $scope.$parent.vm.a = 1;
    vm.login = login;

    function login() {
        var request = {
            username: vm.username,
            password: vm.password
        };
        console.log(request);
        return authService.login(request, vm.remember === true ? 1 : 0).then(function (res) {
            toastr.success(res);
            $state.go('layout.homepage');
        }, function (err) {
            toastr.error(err);
        });
    }
}