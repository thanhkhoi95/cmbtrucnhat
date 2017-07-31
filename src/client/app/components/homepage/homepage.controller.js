(function () {
    angular.module('app.homepage')
        .controller('HomePageController', ['$scope', '$q', '$http', '$state', 'authService', HomepageController]);

    function HomepageController($scope, $q, $http, $state, authService) {
        var currentPage = 1;
        var pageSize = 12;
        var vm = this;
        vm.sw = 1;
        vm.loadMore = loadMore;
        vm.isBusy = false;

        vm.playBtnClick = playBtnClick;
        vm.nextTrack = nextTrack;
        vm.previousTrack = previousTrack;
        vm.changePlayMode = changePlayMode;
        vm.playClickedTrack = playClickedTrack;
        vm.removePlaylistItem = removePlaylistItem;
        vm.playNow = playNow;
        vm.addToPlaylist = addToPlaylist;
        vm.showInfo = showInfo;

        vm.getSourceApiUrl = 'http://localhost:3000/api/music/play?id=';
        vm.playingTrackId = '';
        vm.playingTrackName = '';
        vm.playMode = 0;
        vm.song = {};

        var isPlaying = false;
        var myAudio = document.getElementById('music');
        var myAudioSource = document.getElementById('audioSource');
        var durationMinutes, durationSeconds;
        var currentMinutes = 0, currentSeconds;
        var displayTime;
        vm.displayTime = displayTime;

        $scope.tracksList = [];

        $scope.playlist = [];

        updateVolumeBar();

        function changePlayMode() {
            vm.playMode++;
            if (vm.playMode > 2) vm.playMode = 0;
        }

        function updateVolumeBar() {
            $('#adjustVolumeBar').width(100 * myAudio.volume);
        }

        function removePlaylistItem(trackId) {
            if (vm.playingTrackId === trackId) {
                vm.playingTrackId = '';
                vm.playingTrackName = '';
                myAudioSource.src = '';
                $('#progressBar').width(0);
                $('#bufferBar').width(0);
                myAudio.load();
            }
            for (var track in $scope.playlist) {
                if ($scope.playlist[track]._id === trackId) {
                    $scope.playlist.splice(track, 1);
                    break;
                }
            }
        }

        function playClickedTrack(trackId) {
            for (var track in $scope.playlist) {
                if ($scope.playlist[track]._id === trackId) {
                    vm.playingTrackId = $scope.playlist[track]._id;
                    vm.playingTrackName = $scope.playlist[track].name;
                    myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
                    myAudio.load();
                    myAudio.play();
                }
            }
        }

        function playNow(trackId) {
            for (var track in $scope.tracksList) {
                if ($scope.tracksList[track]._id === trackId) {
                    $scope.playlist = [];
                    $scope.playlist.push($scope.tracksList[track]);
                    playClickedTrack(trackId);
                    break;
                }
            }
        }

        function addToPlaylist(trackId) {
            for (var track in $scope.tracksList) {
                if ($scope.tracksList[track]._id === trackId) {
                    for (var track2 in $scope.playlist) {
                        if ($scope.playlist[track2]._id === trackId) {
                            return;
                        }
                    }
                    $scope.playlist.push($scope.tracksList[track]);
                    break;
                }
            }
        }

        function showInfo(trackId) {
            for (var track in $scope.tracksList) {
                if ($scope.tracksList[track]._id === trackId) {
                    vm.song = $scope.tracksList[track];
                    vm.song.lyric = vm.song.lyric.replace(/\n/g, '<br>');
                }
            }
        }

        function nextTrack() {
            myAudio.pause();
            for (var track in $scope.playlist) {
                if ($scope.playlist[track]._id === vm.playingTrackId) {
                    track++;
                    if (track === $scope.playlist.length) {
                        vm.playingTrackIndex = track;
                        vm.playingTrackId = $scope.playlist[0]._id;
                        vm.playingTrackName = $scope.playlist[track].name;
                    } else {
                        vm.playingTrackIndex = track;
                        vm.playingTrackId = $scope.playlist[track]._id;
                        vm.playingTrackName = $scope.playlist[track].name;
                    }
                    break;
                }
            }
            myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
            myAudio.load();
            myAudio.play();
        }

        function previousTrack() {
            myAudio.pause();
            for (var track in $scope.playlist) {
                if ($scope.playlist[track]._id === vm.playingTrackId) {
                    track--;
                    if (track === -1) {
                        track = $scope.playlist.length - 1;
                        vm.playingTrackIndex = track;
                        vm.playingTrackId = $scope.playlist[track]._id;
                        vm.playingTrackName = $scope.playlist[track].name;
                    } else {
                        vm.playingTrackIndex = track;
                        vm.playingTrackId = $scope.playlist[track]._id;
                        vm.playingTrackName = $scope.playlist[track].name;
                    }
                    break;
                }
            }
            myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
            myAudio.load();
            myAudio.play();
        }

        function pad(num) {
            var s = '00' + num;
            return s.substr(s.length - 2);
        }

        function updateBufferBar() {
            var duration = myAudio.duration;
            for (var i = 0; i < myAudio.buffered.length; i++) {
                if (myAudio.buffered.start(myAudio.buffered.length - 1 - i) < myAudio.currentTime) {
                    $('#bufferBar').width(myAudio.buffered.end(myAudio.buffered.length - 1 - i) / duration * 100 + '%');
                    break;
                }
            }
        }

        function switchPlayAndPauseImage() {
            if (isPlaying) {
                $('#playBtn').css('background-image', 'url(\'../src/client/assets/images/pause.svg\')');
                $('#playBtn').css('background-position', 'center');
            } else {
                $('#playBtn').css('background-image', 'url(\'../src/client/assets/images/play-arrow.svg\')');
                $('#playBtn').css('background-position', '7px 6px');
            }
        }

        $('#defaultBar').click(function (e) {
            var posX = $(this).offset().left;
            var seek = (e.pageX - posX) / $(this).width();
            if (seek > 1) {
                seek = 1;
            }
            if (seek < 0) {
                seek = 0;
            }
            myAudio.pause();
            myAudio.currentTime = seek * myAudio.duration;
            myAudio.play();
        });

        $('#defaultVolumeBar').click(function (e) {
            var posX = $(this).offset().left;
            var volume = (e.pageX - posX) / $(this).width();
            if (volume > 1) {
                volume = 1;
            }
            if (volume < 0) {
                volume = 0;
            }
            myAudio.volume = volume;
            updateVolumeBar();
        });

        myAudio.addEventListener('ended', function () {
            myAudio.pause();
            switch (vm.playMode) {
                case 0:
                    for (var track in $scope.playlist) {
                        if ($scope.playlist[track]._id === vm.playingTrackId) {
                            track++;
                            if (track === $scope.playlist.length) {
                                vm.playingTrackIndex = track;
                                vm.playingTrackId = $scope.playlist[0]._id;
                                myAudio.pause();
                                myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
                                vm.playingTrackName = $scope.playlist[0].name;
                                myAudio.load();
                                $('#progressBar').width(0);
                                updateBufferBar();
                                $scope.$apply();
                                return;
                            } else {
                                vm.playingTrackIndex = track;
                                vm.playingTrackId = $scope.playlist[track]._id;
                                vm.playingTrackName = $scope.playlist[track].name;
                            }
                            break;
                        }
                    }
                    myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
                    myAudio.load();
                    updateBufferBar();
                    break;
                case 1:
                    myAudio.currentTime = 0;
                    break;
                case 2:
                    nextTrack();
                    $scope.$apply();
                    return;
            }
            $scope.$apply();
            myAudio.play();
        });

        myAudio.addEventListener('loadedmetadata', function () {
            durationMinutes = Math.floor(myAudio.duration / 60);
            durationSeconds = Math.floor(myAudio.duration - 60 * durationMinutes);
            displayTime = pad(currentMinutes) + ':' + pad(currentSeconds) + '/' + pad(durationMinutes) + ':' + pad(durationSeconds);
            $('#time').html(displayTime);
        });

        myAudio.addEventListener('progress', function () {
            updateBufferBar();
        });

        myAudio.addEventListener('timeupdate', function () {
            var duration = myAudio.duration;
            if (duration > 0) {
                $('#progressBar').width(((myAudio.currentTime / duration) * 100) + '%');
            }
            currentMinutes = Math.floor(myAudio.currentTime / 60);
            currentSeconds = Math.floor(myAudio.currentTime - 60 * currentMinutes);
            displayTime = pad(currentMinutes) + ':' + pad(currentSeconds) + '/' + pad(durationMinutes) + ':' + pad(durationSeconds);
            $('#time').html(displayTime);
            updateBufferBar();
        });

        myAudio.addEventListener('play', function () {
            isPlaying = true;
            switchPlayAndPauseImage();
            updateBufferBar();
        });

        myAudio.addEventListener('pause', function () {
            isPlaying = false;
            switchPlayAndPauseImage();
        });

        myAudio.addEventListener('emptied', function () {
            isPlaying = false;
            switchPlayAndPauseImage();
        });

        function playBtnClick() {
            if (!isPlaying) {
                myAudio.play();
            } else {
                myAudio.pause();
            }
        }

        function getSuggestedMatchList(pageIndex) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/api/music?pageIndex=' + pageIndex + '&pageSize=' + pageSize
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function () {
                deferred.reject(null);
            });
            return deferred.promise;
        }

        function loadMore() {
            if (!vm.isBusy) {
                vm.isBusy = true;
                var more = getSuggestedMatchList(currentPage);
                more.then(
                    function (res){
                        for (var i in res.items) {
                            if (res.items[i]) {
                                res.items[i].birthdate = moment(res.items[i].time).format('DD-MM-YYYY');
                                $scope.tracksList.push(res.items[i]);
                            }
                        }

                        if (currentPage < res.totalPage) {
                            currentPage++;
                            vm.isBusy = false;
                        }
                    }
                );
            }
        }
    }
})();