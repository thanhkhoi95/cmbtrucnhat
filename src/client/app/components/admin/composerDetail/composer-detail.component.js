angular.module('app.admin')
    .component('composerDetail', {
        templateUrl: 'app/components/admin/composerDetail/composer-detail.html',
        controller: composerDetailController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            currentMusicianIndex: '=',
            composersList: '=',
            setCurrentSongMusician: '&',
            currentMusician: '='
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
    vm.choose = choose;

    vm.nextAction = -1;
    vm.confirm = confirm;
    vm.title = '';
    vm.backActionMode = 0;

    if (vm.currentMusicianIndex <= -1) {
        vm.title = 'Add new composer';
    } else {
        vm.title = 'Composer\'s information';
    }

    $('#ComposerConfirmModal').on('hidden.bs.modal', backAction);

    function choose(noGetBack) {
        var a = JSON.parse(JSON.stringify(vm.currentMusician));
        console.log(a);
        a.birthdate = undefined;
        vm.setCurrentSongMusician({musician: a});
        if (!noGetBack) back();
    }

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
                        toastr.success('Update composer information successfully');
                        vm.composersList[vm.currentMusicianIndex] = data.composer;
                    },
                    function (err) {
                        toastr.error(err);
                    }
                );
                vm.backActionMode = 0;
                $('#ComposerConfirmModal').modal('hide');
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
                $('#ComposerConfirmModal').modal('hide');
                break;
            }
            case 2: {
                saveRequest().then(
                    function (data) {
                        toastr.success('Add new composer successfully');
                        if (vm.subState[0] === 1) {
                            vm.currentMusician = data.newMusician;
                            choose(true);
                            vm.backAction = 1;
                            $('#singerConfirmModal').modal('hide');
                            return;
                        }
                        reset();
                    },
                    function (err) {
                        toastr.error(err);
                    }
                );
                $('#ComposerConfirmModal').modal('hide');
                break;
            }
        }
    }

    function back(backOnly) {
        if (backOnly && vm.currentMusicianIndex !== -2) {
            vm.subState[2] = 0;
            return;
        }
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
        $('#ComposerConfirmModal').modal('toggle');
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
        if (vm.currentMusicianIndex > -1 || vm.currentMusicianIndex === -2) {
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
            var updatedMusician = JSON.parse(JSON.stringify(vm.currentMusician));
            if (vm.currentMusician.birthdate instanceof Date && !isNaN(vm.currentMusician.birthdate.valueOf())) {
                updatedMusician.birthdate = vm.currentMusician.birthdate.toISOString();
            } else {
                updatedMusician.birthdate = undefined;
            }
            req.data = updatedMusician;
            errMessage = 'Add new composer failed!';
        }

        $http(req).then(
            function successCallback(response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(errMessage);
            }
        );

        return deferred.promise;
    }

    function getMusician(id) {
        var req = {
            url: '/api/musician/getMusician/' + id,
            method: 'GET'
        };
        var deferred = $q.defer();
        $http(req).then(
            function successCallback(response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject('Composer not found!');
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
        } else if (vm.currentMusicianIndex === -1) {
            vm.currentMusician = JSON.parse(JSON.stringify(vm.newComposer));
        } else if (vm.currentMusicianIndex === -2) {
            getMusician(vm.currentMusician._id).then(
                function (data) {
                    console.log(data);
                    if (data.musician.birthdate) {
                        data.musician.birthdate = moment(data.musician.birthdate).format('MM/DD/YYYY');
                        data.musician.birthdate = new Date(data.musician.birthdate);
                    }
                    vm.currentMusician = data.musician;
                },
                function (err) {
                    toastr.error(err);
                    vm.currentMusician = {
                        name: 'Unknown',
                        _id: ''
                    }
                    choose();
                }
            );
        }
    }

    reset();

}
