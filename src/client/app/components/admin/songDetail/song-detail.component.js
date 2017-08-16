angular.module('app.admin')
    .component('songDetail', {
        templateUrl: 'app/components/admin/songDetail/song-detail.html',
        controller: songDetailController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            currentMusicIndex: '=',
            songsList: '=',
            currentSong: '=',
            changeCurrentArtistIndex: '&',
            setCurrentArtist: '&',
            changeCurrentMusicianIndex: '&',
            setCurrentMusician: '&'
        }
    });

songDetailController.$inject = ['$scope', '$http', '$q', '$timeout', 'authService', 'Upload'];

function songDetailController($scope, $http, $q, $timeout, authService, Upload) {
    var vm = this;

    vm.newSong = {
        name: '',
        artist: {
            name: 'Unknown',
            _id: ''
        },
        musician: {
            name: 'Unknown',
            _id: ''
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
    vm.dismissModalOnly = false;
    vm.dismissModal = dismissModal;
    vm.goToArtistsList = goToArtistsList;
    vm.goToMusiciansList = goToMusiciansList;
    vm.removeSongArtist = removeSongArtist;
    vm.removeSongMusician = removeSongMusician;
    vm.viewArtistInfo = viewArtistInfo;
    vm.viewMusicianInfo = viewMusicianInfo;

    if (vm.currentMusicIndex <= -1) {
        vm.title = 'Add new song';
    } else {
        vm.title = 'Song\'s information';
    }

    $('#songConfirmModal').on('hidden.bs.modal', backAction);

    function viewArtistInfo() {
        vm.changeCurrentArtistIndex({index: -2});
        vm.setCurrentArtist({artist: vm.currentSong.artist});
        vm.subState[1] = 1;
        vm.menu = 1;
    }

    function viewMusicianInfo() {
        vm.changeCurrentMusicianIndex({index: -2});
        vm.setCurrentMusician({musician: vm.currentSong.musician});
        vm.subState[2] = 1;
        vm.menu = 2;
    }

    function removeSongArtist() {
        vm.currentSong.artist = {
            name: 'Unknown',
            _id: ''
        }
    }

    function removeSongMusician() {
        vm.currentSong.musician = {
            name: 'Unknown',
            _id: ''
        }
    }

    function goToMusiciansList() {
        vm.subState[2] = 0;
        vm.menu = 2;
    }

    function goToArtistsList() {
        vm.subState[1] = 0;
        vm.menu = 1;
    }

    function dismissModal() {
        vm.dismissModalOnly = true;
        $('#songConfirmModal').modal('hide');
    }

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
                dismissModal();
                break;
            }
            case 1: {
                deleteRequest().then(
                    function (data) {
                        toastr.success('Remove song successfully');
                        vm.songsList.splice(vm.currentMusicIndex, 1);
                        vm.backActionMode = 1;
                        $('#songConfirmModal').modal('hide');
                    },
                    function (err) {
                        toastr.error(err);
                    }
                );
                break;
            }
            case 2: {
                saveRequest().then(
                    function (data) {
                        toastr.success('Add new song successfully');
                        reset();
                        dismissModal();
                    },
                    function (err) {
                        toastr.error(err);
                    }
                );
                break;
            }
        }
    }

    function back() {
        if (!vm.dismissModalOnly) {
            vm.subState[0] = 0;
        } else {
            vm.dismissModalOnly = false;
        }
    }

    function action(nextAction) {
        if (vm.currentMusicIndex === -1 && !document.getElementById('musicFile').checkValidity()) return;
        if (!document.getElementById('musicName').checkValidity()) return;
        vm.nextAction = nextAction;
        $('#songConfirmModal').modal('toggle');
    }

    function deleteRequest() {
        var token = authService.getToken();
        var req = {
            method: 'DELETE',
            url: '/api/music/' + vm.currentSong._id,
            headers: {
                'x-access-token': token
            }
        };
        var deferred = $q.defer();
        $http(req).then(
            function successCallback(response) {
                deferred.resolve(response.data);
            }, function () {
                deferred.reject('Remove song failed!');
            }
        );

        return deferred.promise;
    }

    function saveRequest() {
        var token = authService.getToken();
        var deferred = $q.defer();
        if (vm.currentMusicIndex > -1) {
            var req = {
                url: '/api/music',
                headers: {
                    'x-access-token': token
                }
            };
            var errMessage = '';
            var updatedSong = JSON.parse(JSON.stringify(vm.currentSong));
            if (updatedSong.artist._id !== '') {
                updatedSong.artistId = updatedSong.artist._id;
            }
            if (updatedSong.musician._id !== '') {
                updatedSong.musicianId = updatedSong.musician._id;
            }
            if (updatedSong.lyric === '') {
                updatedSong.lyric = 'Unavailable';
            }

            req.method = 'PUT';
            req.data = updatedSong;
            errMessage = 'Update song information failed!';
            console.log(req);
            $http(req).then(
                function successCallback(response) {
                    deferred.resolve(response.data);
                }, function (err) {
                    deferred.reject(errMessage);
                    console.log(err);
                }
            );
        } else {
            var updatedSong = JSON.parse(JSON.stringify(vm.currentSong));
            var reqData = {
                name: vm.currentSong.name,
                lyric: vm.currentSong.lyric,
                music: vm.currentSong.musicFile
            }

            if (updatedSong.artist._id !== '') {
                reqData.artistId = updatedSong.artist._id;
            }
            if (updatedSong.musician._id !== '') {
                reqData.musicianId = updatedSong.musician._id;
            }

            Upload.upload({
                url: '/api/music/create',
                data: reqData,
                headers: {
                    'x-access-token': token
                }
            }).then(
                function (response) {
                    var data;
                    $timeout(function () {
                        data = response.data;
                        deferred.resolve(data);
                    });
                },
                function (err) {
                    deferred.reject('Add new song failed!');
                },
                function (evt) {
                    vm.currentSong.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }
            );
        }

        return deferred.promise;
    }

    function reset() {
        if (vm.currentMusicIndex > -1) {
            vm.currentSong = JSON.parse(JSON.stringify(vm.songsList[vm.currentMusicIndex]));
            vm.currentSong.uploadDate = new Date(vm.currentSong.uploadDate);
            if (!vm.currentSong.artist) {
                vm.currentSong.artist = {
                    name: 'Unknown',
                    _id: ''
                };
            } else {
                vm.currentSong.artist.birthdate = undefined;
            }
            if (!vm.currentSong.musician) {
                vm.currentSong.musician = {
                    name: 'Unknown',
                    _id: ''
                };
            } else {
                vm.currentSong.musician.birthdate = undefined;
            }
        } else {
            vm.currentSong = JSON.parse(JSON.stringify(vm.newSong));
        }
    }

    reset();

}
