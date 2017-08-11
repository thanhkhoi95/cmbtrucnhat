angular.module('app.admin')
    .component('songDetail', {
        templateUrl: 'app/components/admin/songDetail/song-detail.html',
        controller: songDetailController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            currentMusicIndex: '=',
            songsList: '='
        }
    });

songDetailController.$inject = ['$scope', '$http', '$q', 'authService'];

function songDetailController($scope, $http, $q, authService) {
    var vm = this;

    vm.newSong = {
        name: '',
        artist: {
            name: 'Unknown',
            id: ''
        },
        musician: {
            name: 'Unknown',
            id: ''
        },
        lyric: 'Not available'
    };

    console.log(vm.songsList[vm.currentMusicIndex]);

    vm.action = action;
    vm.reset = reset;
    vm.back = back;
    vm.nextAction = -1;
    vm.confirm = confirm;
    vm.title = '';
    vm.backActionMode = 0;

    if (vm.currentSongIndex <= -1) {
        vm.title = 'Add new song';
    } else {
        vm.title = 'Song\'s information';
    }

    $('#confirmModal').on('hidden.bs.modal', backAction);

    function backAction() {
        back();
        $scope.$apply();
    }

    function confirm() {
        switch (vm.nextAction) {
            case 0: {
                saveRequest().then(
                    function (data) {
                        toastr.success('Update song information successfully');
                        vm.songsList[vm.currentMusicIndex] = data.music;
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
                        vm.singersList.splice(vm.currentSongIndex, 1);
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
        vm.subState[0] = 0;
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
            url: '/api/artist/' + vm.currentSong._id,
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
        if (vm.currentSongIndex > -1) {
            var updatedArtist = JSON.parse(JSON.stringify(vm.currentSong));
            if (vm.currentSong.birthdate instanceof Date && !isNaN(vm.currentSong.birthdate.valueOf())) {
                updatedArtist.birthdate = vm.currentSong.birthdate.toISOString();
            } else {
                updatedArtist.birthdate = undefined;
            }
            req.data = updatedArtist;
            req.method = 'PUT';
            if (vm.currentSong.detailInformation === '') {
                vm.currentSong.detailInformation = undefined;
            }
            errMessage = 'Update artist information failed!';
        } else {
            req.method = 'POST';
            if (vm.currentSong.birthdate instanceof Date && !isNaN(vm.currentSong.birthdate.valueOf())) {
                vm.currentSong.birthdate = vm.currentSong.birthdate.toISOString();
            } else {
                vm.currentSong.birthdate = undefined;
            }
            req.data = vm.currentSong;
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
        if (vm.currentMusicIndex > -1) {
            vm.currentSong = JSON.parse(JSON.stringify(vm.songsList[vm.currentMusicIndex]));
            vm.currentSong.uploadDate = new Date(vm.currentSong.uploadDate);
        } else {
            vm.currentSong = JSON.parse(JSON.stringify(vm.newSong));
        }
    }

    reset();

}
