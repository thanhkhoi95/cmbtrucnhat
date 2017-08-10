angular.module('app.admin')
    .component('singerDetail', {
        templateUrl: 'app/components/admin/singerDetail/singer-detail.html',
        controller: singerDetailController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            currentArtistIndex: '=',
            singersList: '='
        }
    });

singerDetailController.$inject = ['$scope', '$http', '$q', 'authService'];

function singerDetailController($scope, $http, $q, authService) {
    var vm = this;

    vm.newArtist = {
        name: '',
        birthdate: undefined,
        detailInformation: undefined
    };

    vm.action = action;
    vm.reset = reset;
    vm.back = back;
    vm.nextAction = -1;
    vm.confirm = confirm;
    vm.title = '';
    vm.backActionMode = 0;

    if (vm.currentArtistIndex <= -1) {
        vm.title = 'Add new artist';
    } else {
        vm.title = 'Artist\'s information';
    }

    $('#confirmModal').on('hidden.bs.modal', backAction);

    function backAction() {
        switch (vm.backActionMode) {
            case 0: {
                if (vm.subState[0] === 1) {
                    back();
                }
                break;
            }
            case 1: {
                back();
                break;
            }
        }
        $scope.$apply();
    }

    function confirm() {
        switch (vm.nextAction) {
            case 0: {
                saveRequest().then(
                    function (data) {
                        toastr.success('Update artist information successfully');
                        vm.singersList[vm.currentArtistIndex] = data.artist;
                    },
                    function (err) {
                        toastr.error(err);
                    }
                );
                vm.backActionMode = 0;
                $('#confirmModal').modal('hide');
                break;
            }
            case 1: {
                deleteRequest().then(
                    function (data) {
                        toastr.success('Remove artist successfully');
                        vm.singersList.splice(vm.currentArtistIndex, 1);
                    },
                    function (err) {
                        toastr.error(err);
                    }
                );
                vm.backActionMode = 1;
                $('#confirmModal').modal('hide');
                break;
            }
            case 2: {
                saveRequest().then(
                    function (data) {
                        toastr.success('Add new artist successfully');
                        reset();
                    },
                    function (err) {
                        toastr.error(err);
                    }
                );
                $('#confirmModal').modal('hide');
                break;
            }
        }
    }

    function back() {
        if (vm.subState[0] === 1) {
            vm.menu = 0;
        } else {
            vm.subState[1] = 0;
        }
    }

    function action(nextAction) {
        if (!document.getElementById('artistName').checkValidity() ||
            !document.getElementById('artistBirthdate').checkValidity()) return;
        vm.nextAction = nextAction;
        $('#confirmModal').modal('toggle');
    }

    function deleteRequest() {
        var token = authService.getToken();
        var req = {
            method: 'DELETE',
            url: '/api/artist/' + vm.currentArtist._id,
            headers: {
                'x-access-token': token
            }
        };
        var deferred = $q.defer();
        $http(req).then(
            function successCallback(response) {
                deferred.resolve(response.data);
            }, function () {
                deferred.reject('Remove artist failed!');
            }
        );

        return deferred.promise;
    }

    function saveRequest() {
        var token = authService.getToken();
        var req = {
            url: '/api/artist',
            headers: {
                'x-access-token': token
            }
        };
        var errMessage = '';
        var deferred = $q.defer();
        if (vm.currentArtistIndex > -1) {
            var updatedArtist = JSON.parse(JSON.stringify(vm.currentArtist));
            if (vm.currentArtist.birthdate instanceof Date && !isNaN(vm.currentArtist.birthdate.valueOf())) {
                updatedArtist.birthdate = vm.currentArtist.birthdate.toISOString();
            } else {
                updatedArtist.birthdate = undefined;
            }
            req.data = updatedArtist;
            req.method = 'PUT';
            if (vm.currentArtist.detailInformation === '') {
                vm.currentArtist.detailInformation = undefined;
            }
            errMessage = 'Update artist information failed!';
        } else {
            req.method = 'POST';
            if (vm.currentArtist.birthdate instanceof Date && !isNaN(vm.currentArtist.birthdate.valueOf())) {
                vm.currentArtist.birthdate = vm.currentArtist.birthdate.toISOString();
            } else {
                vm.currentArtist.birthdate = undefined;
            }
            req.data = vm.currentArtist;
            errMessage = 'Add new artist failed!';
        }

        console.log(req);
        $http(req).then(
            function successCallback(response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(errMessage);
                console.log(err);
            }
        );

        return deferred.promise;
    }

    function reset() {
        if (vm.currentArtistIndex > -1) {
            vm.currentArtist = JSON.parse(JSON.stringify(vm.singersList[vm.currentArtistIndex]));
            if (vm.currentArtist.birthdate) {
                vm.currentArtist.birthdate = new Date(vm.currentArtist.birthdate);
            }
        } else {
            vm.currentArtist = JSON.parse(JSON.stringify(vm.newArtist));
        }
    }

    reset();

}
