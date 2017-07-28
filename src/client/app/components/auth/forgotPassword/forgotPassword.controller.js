angular.module('app.forgotPassword')
    .controller('forgotPasswordController', forgotPasswordController);

forgotPasswordController.$inject = ['$scope', '$state', '$stateParams', 'authService'];

function forgotPasswordController($scope, $state, $stateParams, authService) {
    var vm = this;
    $scope.$parent.vm.a = 1;
    vm.sendMail = sendMail;
    vm.resetPassword = resetPassword;


    function sendMail() {
        var request = {
            email: vm.email
        };
        console.log(request);
        return authService.sendMail(request).then(function (res) {
            toastr.success(res);

        }, function (err) {
            toastr.error(err);
        });
    }

    function resetPassword() {
        if (vm.newPassword === vm.passwordConfirm) {

            var request = {
                newPassword: vm.newPassword,
                token: $stateParams.token
            };

            return authService.resetPassword(request).then(function (res) {
                toastr.success(res);

            }, function (err) {
                toastr.error(err);
            });
        } else {
            toastr.error('Please match password');
        }
    }

}