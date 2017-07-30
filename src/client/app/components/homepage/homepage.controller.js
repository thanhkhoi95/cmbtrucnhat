/*jshint esversion: 6*/

(function () {
    angular.module('app.homepage')
        .controller('HomePageController', ['$scope', '$q', '$http', '$state', 'authService', HomepageController]);

    function HomepageController($scope, $q, $http, $state, authService) {
        var currentPage = 1;
        var pageSize = 6;
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

        vm.getSourceApiUrl = 'http://localhost:3000/api/music/play?id=';
        vm.playingTrackId = "";
        vm.playingTrackName = "";
        vm.playMode = 0;

        var isPlaying = false;
        var myAudio = document.getElementById('music');
        var myAudioSource = document.getElementById('audioSource');
        var durationMinutes, durationSeconds;
        var currentMinutes = 0, currentSeconds;
        var displayTime;

        $scope.playlist = [{ "_id": "597a09edd810621400753940", "name": "La La La", "uploadDate": "1970-01-01T00:00:00.027Z", "__v": 0, "downloads": 0, "plays": 0, "lyric": "Không có" }, { "_id": "597a09f6d810621400753941", "name": "La La La", "uploadDate": "1970-01-01T00:00:00.027Z", "__v": 0, "downloads": 0, "plays": 0, "lyric": "Không có", "artist": { "_id": "59760b350539031018d2778d", "name": "Phạm Hồng Phước", "detailInformation": "Anh sinh ra thuộc cung Kim Ngưu, anh cầm tinh con (giáp) dê (Tân Mùi 1991). Phạm Hồng Phước xếp hạng nổi tiếng vào thứ 750 ở trên thế giới và xếp hạng thứ 171 ở trong danh sách các Ca sĩ nổi tiếng. Phạm Hồng Phước đã từng tham gia vào trong chương trình Việt Nam Idol của năm 2012, anh từng được đứng ở Top 3 thí sinh được các khán giả bình chọn nhiều nhất nhưng anh lại sớm bị loại.", "birthdate": "1991-05-12T17:00:00.000Z", "__v": 0 } }, {
            "_id": "597d78e138447309b482a15c",
            "uploadDate": "2017-07-29T17:00:00.000Z",
            "name": "Thương mấy cũng là người dưng",
            "__v": 0,
            "downloads": 0,
            "plays": 0,
            "lyric": "Không có"
        }];

        vm.playingTrackId = $scope.playlist[0]._id;

        myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
        vm.playingTrackName = $scope.playlist[0].name;
        myAudio.load();

        updateVolumeBar();

        function changePlayMode() {
            vm.playMode++;
            if (vm.playMode > 2) vm.playMode = 0;
        }

        function updateVolumeBar() {
            $("#adjustVolumeBar").width(100 * myAudio.volume);
        }

        function removePlaylistItem(trackId) {
            console.log(trackId);
            if (vm.playingTrackId === trackId) {
                vm.playingTrackId = '';
                vm.playingTrackName = '';
                myAudioSource.src = "";
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
                    console.log(track);
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
            var s = "00" + num;
            return s.substr(s.length - 2);
        }

        function updateBufferBar() {
            var duration = myAudio.duration;
            for (var i = 0; i < myAudio.buffered.length; i++) {
                if (myAudio.buffered.start(myAudio.buffered.length - 1 - i) < myAudio.currentTime) {
                    $("#bufferBar").width(myAudio.buffered.end(myAudio.buffered.length - 1 - i) / duration * 100 + "%");
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
            displayTime = pad(currentMinutes) + ":" + pad(currentSeconds) + "/" + pad(durationMinutes) + ":" + pad(durationSeconds);
            $('#time').html(displayTime);
        });

        myAudio.addEventListener('progress', function () {
            updateBufferBar();
        });

        myAudio.addEventListener('timeupdate', function () {
            var duration = myAudio.duration;
            if (duration > 0) {
                $('#progressBar').width(((myAudio.currentTime / duration) * 100) + "%");
            }
            currentMinutes = Math.floor(myAudio.currentTime / 60);
            currentSeconds = Math.floor(myAudio.currentTime - 60 * currentMinutes);
            displayTime = pad(currentMinutes) + ":" + pad(currentSeconds) + "/" + pad(durationMinutes) + ":" + pad(durationSeconds);
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

        function run() {

        }

        function getSuggestedMatchList(pageIndex) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/api/match/getPagination/' + authService.getToken()._id + '/' + pageIndex + '/' + pageSize
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
                    (res) => {
                        for (var i in res.items) {
                            if (res.items[i]) {
                                res.items[i].date = moment(res.items[i].time).format('DD-MM-YYYY');
                                res.items[i].time = moment(res.items[i].time).format('hh:mm');
                                res.items[i].dayOfWeek = moment(res.items[i].date, 'DD-MM-YYYY').weekday();
                                vm.teams.push(res.items[i]);
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

        function rankSwitch(sw) {
            vm.sw = sw;
            vm.ranks = vm.sw === 1 ? teamRank : personRank;
        }
    }
})();