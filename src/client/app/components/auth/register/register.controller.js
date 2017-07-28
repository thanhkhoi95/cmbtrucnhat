angular.module('app.register')
    .controller('RegisterController', ['$scope', '$state', 'authService', RegisterController]);

function RegisterController($scope, $state, authService) {
    $scope.$parent.vm.a = 2;
    var vm = this;
    vm.gender = 'Male"';
    vm.register = function () {
        var newUser = {
            email: vm.email,
            password: vm.password,
            username: vm.username,
            firstname: vm.firstname,
            lastname: vm.lastname,
            birthday: vm.birthday,
            gender: vm.gender,
            position: vm.position,
            phone: vm.phone,
            address: vm.address
        };
        console.log(newUser);
        return authService.register(newUser).then(
            function (res) {
                toastr.success(res);
                $state.go('auth.login');
            },
            function (err) {
                toastr.error(err);
            }
        );
    };
}