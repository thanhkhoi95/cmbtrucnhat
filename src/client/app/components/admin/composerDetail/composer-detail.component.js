angular.module('app.admin')
    .component('composerDetail', {
        templateUrl: 'app/components/admin/composerDetail/composer-detail.html',
        controller: composerDetailController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            currentMusicianIndex: '=',
            composersList: '='
        }
    });

    composerDetailController.$inject = ['$scope', '$http', '$q', 'authService'];

function composerDetailController($scope, $http, $q, authService) {
    var vm = this;

    vm.newComposer = {
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

    console.log(vm.currentMusicianIndex);

    if (vm.currentMusicianIndex <= -1) {
        vm.title = 'Add new composer';
    } else {
        vm.title = 'Composer\'s information';
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
                        console.log(data);
                        toastr.success('Update composer information successfully');
                        vm.composersList[vm.currentMusicianIndex] = data.composer;
                        console.log(vm.composersList);
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
                        toastr.success('Remove composer successfully');
                        vm.composersList.splice(vm.currentMusicianIndex, 1);
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
                        toastr.success('Add new composer successfully');
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
            vm.subState[2] = 0;
        }
    }

    function action(nextAction) {
        if (!document.getElementById('musicianName').checkValidity() ||
            !document.getElementById('musicianBirthdate').checkValidity()) return;
        vm.nextAction = nextAction;
        $('#confirmModal').modal('toggle');
    }

    function deleteRequest() {
        var token = authService.getToken();
        var req = {
            method: 'DELETE',
            url: '/api/musician/' + vm.currentMusician._id,
            headers: {
                'x-access-token': token
            }
        };
        var deferred = $q.defer();
        $http(req).then(
            function successCallback(response) {
                deferred.resolve(response.data);
            }, function () {
                deferred.reject('Remove composer failed!');
            }
        );

        return deferred.promise;
    }

    function saveRequest() {
        var token = authService.getToken();
        var req = {
            url: '/api/musician',
            headers: {
                'x-access-token': token
            }
        };
        var errMessage = '';
        var deferred = $q.defer();
        if (vm.currentMusicianIndex > -1) {
            var updatedMusician = JSON.parse(JSON.stringify(vm.currentMusician));
            if (vm.currentMusician.birthdate instanceof Date && !isNaN(vm.currentMusician.birthdate.valueOf())) {
                updatedMusician.birthdate = vm.currentMusician.birthdate.toISOString();
            } else {
                updatedMusician.birthdate = undefined;
            }
            req.data = updatedMusician;
            req.method = 'PUT';
            if (vm.currentMusician.detailInformation === '') {
                vm.currentMusician.detailInformation = undefined;
            }
            errMessage = 'Update composer information failed!';
        } else {
            req.method = 'POST';
            if (vm.currentMusician.birthdate instanceof Date && !isNaN(vm.currentMusician.birthdate.valueOf())) {
                vm.currentMusician.birthdate = vm.currentMusician.birthdate.toISOString();
            } else {
                vm.currentMusician.birthdate = undefined;
            }
            req.data = vm.currentMusician;
            errMessage = 'Add new composer failed!';
        }

        console.log(req);
        $http(req).then(
            function successCallback(response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(errMessage);
            }
        );

        return deferred.promise;
    }

    function reset() {
        if (vm.currentMusicianIndex > -1) {
            vm.currentMusician = JSON.parse(JSON.stringify(vm.composersList[vm.currentMusicianIndex]));
            if (vm.currentMusician.birthdate) {
                vm.currentMusician.birthdate = new Date(vm.currentMusician.birthdate);
            }
        } else {
            vm.currentMusician = JSON.parse(JSON.stringify(vm.newComposer));
        }
        document.getElementById('musicianName').focus();
    }

    reset();

}
