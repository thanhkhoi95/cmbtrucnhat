(function () {
    angular.module('app.homepage')
        .controller('HomePageController', ['$scope', '$q', '$http', '$state', HomepageController]);

    function HomepageController($scope, $q, $http, $state) {
        var vm = this;
        vm.danhsach = [];
        vm.from = '';
        vm.to = '';

        var more;
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/trucnhat'
        }).then(function successCallback(response) {
            deferred.resolve(response.data);
        }, function () {
            deferred.reject(null);
        });
        more = deferred.promise;
        more.then(function(res){
            vm.danhsach = res.thutu;
            vm.from = res.from;
            vm.to = res.to;
        });

        // var currentPage = 1;
        // var pageSize = 12;
        // var vm = this;
        // vm.sw = 1;
        // vm.loadMore = loadMore;
        // vm.isBusy = false;

        // vm.playBtnClick = playBtnClick;
        // vm.nextTrack = nextTrack;
        // vm.previousTrack = previousTrack;
        // vm.changePlayMode = changePlayMode;
        // vm.playClickedTrack = playClickedTrack;
        // vm.removePlaylistItem = removePlaylistItem;
        // vm.playNow = playNow;
        // vm.addToPlaylist = addToPlaylist;
        // vm.showInfo = showInfo;
        // vm.refresh = refresh;
        // vm.getAll = getAll;
        // vm.check = check;
        // vm.searchSong = searchSong;

        // vm.getSourceApiUrl = '/api/music/play?id=';
        // vm.playingTrackId = '';
        // vm.playingTrackName = '';
        // vm.playMode = 0;
        // vm.song = {};
        // vm.tracksListMode = 0;
        // vm.tracksListTitle = 'Newest tracks';
        // vm.search = {
        //     searchString: ''
        // };

        // vm.isPlaying = false;
        // var myAudio = document.getElementById('music');
        // var myAudioSource = document.getElementById('audioSource');
        // var durationMinutes, durationSeconds;
        // var currentMinutes = 0, currentSeconds;
        // var displayTime = '00:00/00:00';
        // vm.displayTime = displayTime;

        // $scope.tracksList = [];

        // $scope.playlist = [];

        // updateVolumeBar();

        // function getAll(mode) {
        //     if (vm.tracksListMode === mode) return;
        //     vm.tracksListMode = mode;
        //     if (mode === 0) {
        //         vm.tracksListTitle = 'Newest tracks';
        //     } else if (mode === 1) {
        //         vm.tracksListTitle = 'Top tracks';
        //     } else if (mode === 3) {
        //         vm.tracksListTile = 'A to Z';
        //     }
        //     refresh();
        // }

        // function refresh() {
        //     currentPage = 1;
        //     $scope.tracksList = [];
        //     loadMore(true);
        // }

        // function changePlayMode() {
        //     vm.playMode++;
        //     if (vm.playMode > 2) vm.playMode = 0;
        // }

        // function updateVolumeBar() {
        //     $('#adjustVolumeBar').width(100 * myAudio.volume);
        // }

        // function removePlaylistItem(trackId) {
        //     if (vm.playingTrackId === trackId) {
        //         vm.playingTrackId = '';
        //         vm.playingTrackName = '';
        //         myAudioSource.src = '';
        //         $('#progressBar').width(0);
        //         $('#bufferBar').width(0);
        //         myAudio.load();
        //     }
        //     for (var track in $scope.playlist) {
        //         if ($scope.playlist[track]._id === trackId) {
        //             $scope.playlist.splice(track, 1);
        //             break;
        //         }
        //     }
        // }

        // function playClickedTrack(trackId) {
        //     if (trackId === vm.playingTrackId) return;
        //     for (var track in $scope.playlist) {
        //         if ($scope.playlist[track]._id === trackId) {
        //             vm.playingTrackId = $scope.playlist[track]._id;
        //             vm.playingTrackName = $scope.playlist[track].name;
        //             myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
        //             myAudio.load();
        //             myAudio.play();
        //         }
        //     }
        // }

        // function playNow(trackId) {
        //     for (var track in $scope.tracksList) {
        //         if ($scope.tracksList[track]._id === trackId) {
        //             $scope.playlist = [];
        //             $scope.playlist.push($scope.tracksList[track]);
        //             playClickedTrack(trackId);
        //             break;
        //         }
        //     }
        // }

        // function addToPlaylist(trackId) {
        //     for (var track in $scope.tracksList) {
        //         if ($scope.tracksList[track]._id === trackId) {
        //             for (var track2 in $scope.playlist) {
        //                 if ($scope.playlist[track2]._id === trackId) {
        //                     return;
        //                 }
        //             }
        //             $scope.playlist.push($scope.tracksList[track]);
        //             break;
        //         }
        //     }
        // }

        // function showInfo(trackId) {
        //     for (var track in $scope.tracksList) {
        //         if ($scope.tracksList[track]._id === trackId) {
        //             vm.song = $scope.tracksList[track];
        //             vm.song.uploadDate = moment(vm.song.uploadDate).format('DD-MM-YYYY');
        //             if (vm.song.artist) {
        //                 if (vm.song.artist.birthdate) {
        //                     vm.song.artist.birthdate = moment(vm.song.artist.birthdate).format('DD-MM-YYYY');
        //                 }
        //             }
        //             if (vm.song.musician) {
        //                 if (vm.song.musician.birthdate) {
        //                     vm.song.musician.birthdate = moment(vm.song.musician.birthdate).format('DD-MM-YYYY');
        //                 }
        //             }
        //             // vm.song.lyric = vm.song.lyric.replace(/\n/g, '<br>');
        //         }
        //     }
        // }

        // function nextTrack() {
        //     myAudio.pause();
        //     for (var track in $scope.playlist) {
        //         if ($scope.playlist[track]._id === vm.playingTrackId) {
        //             track++;
        //             if (track === $scope.playlist.length) {
        //                 vm.playingTrackIndex = track;
        //                 vm.playingTrackId = $scope.playlist[0]._id;
        //                 vm.playingTrackName = $scope.playlist[0].name;
        //             } else {
        //                 vm.playingTrackIndex = track;
        //                 vm.playingTrackId = $scope.playlist[track]._id;
        //                 vm.playingTrackName = $scope.playlist[track].name;
        //             }
        //             break;
        //         }
        //     }
        //     myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
        //     myAudio.load();
        //     myAudio.play();
        // }

        // function previousTrack() {
        //     myAudio.pause();
        //     for (var track in $scope.playlist) {
        //         if ($scope.playlist[track]._id === vm.playingTrackId) {
        //             track--;
        //             if (track === -1) {
        //                 track = $scope.playlist.length - 1;
        //                 vm.playingTrackIndex = track;
        //                 vm.playingTrackId = $scope.playlist[track]._id;
        //                 vm.playingTrackName = $scope.playlist[track].name;
        //             } else {
        //                 vm.playingTrackIndex = track;
        //                 vm.playingTrackId = $scope.playlist[track]._id;
        //                 vm.playingTrackName = $scope.playlist[track].name;
        //             }
        //             break;
        //         }
        //     }
        //     myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
        //     myAudio.load();
        //     myAudio.play();
        // }

        // function pad(num) {
        //     var s = '00' + num;
        //     return s.substr(s.length - 2);
        // }

        // function updateBufferBar() {
        //     var duration = myAudio.duration;
        //     for (var i = 0; i < myAudio.buffered.length; i++) {
        //         if (myAudio.buffered.start(myAudio.buffered.length - 1 - i) < myAudio.currentTime) {
        //             $('#bufferBar').width(myAudio.buffered.end(myAudio.buffered.length - 1 - i) / duration * 100 + '%');
        //             break;
        //         }
        //     }
        // }

        // function switchPlayAndPauseImage() {
        //     if (vm.isPlaying) {
        //         $('#playBtn').css('background-image', 'url(\'../src/client/assets/images/pause.svg\')');
        //         $('#playBtn').css('background-position', 'center');
        //     } else {
        //         $('#playBtn').css('background-image', 'url(\'../src/client/assets/images/play-arrow.svg\')');
        //         $('#playBtn').css('background-position', '7px 6px');
        //     }
        // }

        // $('#defaultBar').click(function (e) {
        //     var posX = $(this).offset().left;
        //     var seek = (e.pageX - posX) / $(this).width();
        //     if (seek > 1) {
        //         seek = 1;
        //     }
        //     if (seek < 0) {
        //         seek = 0;
        //     }
        //     myAudio.pause();
        //     myAudio.currentTime = seek * (myAudio.duration - 1);
        //     myAudio.play();
        // });

        // $('#defaultVolumeBar').click(function (e) {
        //     var posX = $(this).offset().left;
        //     var volume = (e.pageX - posX) / $(this).width();
        //     if (volume > 1) {
        //         volume = 1;
        //     }
        //     if (volume < 0) {
        //         volume = 0;
        //     }
        //     myAudio.volume = volume;
        //     updateVolumeBar();
        // });

        // function songEndedAction() {
        //     myAudio.pause();
        //     switch (vm.playMode) {
        //         case 0:
        //             for (var track in $scope.playlist) {
        //                 if ($scope.playlist[track]._id === vm.playingTrackId) {
        //                     track++;
        //                     if (track === $scope.playlist.length) {
        //                         vm.playingTrackIndex = track;
        //                         vm.playingTrackId = '';
        //                         myAudio.pause();
        //                         myAudioSource.src = '';
        //                         vm.playingTrackName = '';
        //                         myAudio.load();
        //                         $('#progressBar').width(0);
        //                         updateBufferBar();
        //                         $scope.$apply();
        //                         return;
        //                     } else {
        //                         vm.playingTrackIndex = track;
        //                         vm.playingTrackId = $scope.playlist[track]._id;
        //                         vm.playingTrackName = $scope.playlist[track].name;
        //                     }
        //                     break;
        //                 }
        //             }
        //             myAudioSource.src = vm.getSourceApiUrl + vm.playingTrackId;
        //             myAudio.load();
        //             updateBufferBar();
        //             break;
        //         case 1:
        //             console.log(1);
        //             myAudio.load();
        //             updateBufferBar();
        //             myAudio.currentTime = 0;
        //             break;
        //         case 2:
        //             nextTrack();
        //             $scope.$apply();
        //             return;
        //     }
        //     $scope.$apply();
        //     myAudio.play();
        // }

        // myAudio.addEventListener('ended', function () {
        //     songEndedAction();
        // });

        // myAudio.addEventListener('loadedmetadata', function () {
        //     durationMinutes = Math.floor((myAudio.duration-1) / 60);
        //     durationSeconds = Math.floor((myAudio.duration-1) - 60 * durationMinutes);
        //     displayTime = pad(currentMinutes) + ':' + pad(currentSeconds) + '/' + pad(durationMinutes) + ':' + pad(durationSeconds);
        //     $('#time').html(displayTime);
        // });

        // myAudio.addEventListener('progress', function () {
        //     updateBufferBar();
        // });

        // myAudio.addEventListener('timeupdate', function () {
        //     var duration = myAudio.duration - 1;
        //     var percentage;
        //     if (duration > 0) {
        //         percentage = (myAudio.currentTime / duration) * 100;
        //         percentage = percentage > 100 ? 100 : percentage;
        //         $('#progressBar').width(percentage + '%');
        //     }
        //     currentMinutes = Math.floor(myAudio.currentTime / 60);
        //     currentSeconds = Math.floor(myAudio.currentTime - 60 * currentMinutes);
        //     displayTime = pad(currentMinutes) + ':' + pad(currentSeconds) + '/' + pad(durationMinutes) + ':' + pad(durationSeconds);
        //     $('#time').html(displayTime);
        //     updateBufferBar();
        //     if (duration <= myAudio.currentTime) {
        //         songEndedAction();
        //     }
        // });

        // myAudio.addEventListener('play', function () {
        //     vm.isPlaying = true;
        //     switchPlayAndPauseImage();
        //     updateBufferBar();
        // });

        // myAudio.addEventListener('pause', function () {
        //     vm.isPlaying = false;
        //     switchPlayAndPauseImage();
        // });

        // myAudio.addEventListener('emptied', function () {
        //     vm.isPlaying = false;
        //     switchPlayAndPauseImage();
        // });

        // function playBtnClick() {
        //     if (!vm.isPlaying) {
        //         myAudio.play();
        //     } else {
        //         myAudio.pause();
        //     }
        // }

        // function check(elementId) {
        //     document.getElementById(elementId).checked = true;
        // }

        // function searchSong() {
        //     vm.search.type = $('input[name="searchType"]:checked').val();
        //     vm.search.filter = $('input[name="searchFilter"]:checked').val();
        //     if (!vm.search.searchString || vm.search.searchString === '') return;
        //     $('#searchModal').modal('hide');
        //     vm.tracksListMode = 2;
        //     vm.tracksListTitle = 'Search\'s result';
        //     refresh();
        // }

        // function getTracks(pageIndex) {
        //     var deferred = $q.defer();
        //     var url;
        //     if (vm.tracksListMode === 0) {
        //         url = '/api/music/getnewest?pageIndex=';
        //     } else if (vm.tracksListMode === 1 ) {
        //         url = '/api/music/getpopular?pageIndex=';
        //     } else if (vm.tracksListMode === 3) {
        //         url = '/api/music/getaz?pageIndex=';
        //     }
        //     $http({
        //         method: 'GET',
        //         url: url + pageIndex + '&pageSize=' + pageSize
        //     }).then(function successCallback(response) {
        //         deferred.resolve(response.data);
        //     }, function () {
        //         deferred.reject(null);
        //     });
        //     return deferred.promise;
        // }

        // function getSearchTracks(pageIndex) {
        //     var deferred = $q.defer();
        //     $http.post('/api/music/search?pageIndex=' + pageIndex + '&pageSize=' + pageSize, vm.search).then(
        //         function successCallback(response) {
        //             deferred.resolve(response.data);
        //         }, function (err) {
        //             deferred.reject(err);
        //         }
        //     );
        //     return deferred.promise;
        // }

        // function loadMore(urgent) {
        //     if (!vm.isBusy || urgent) {
        //         vm.isBusy = true;
        //         var more;
        //         if (vm.tracksListMode === 0 || vm.tracksListMode === 1 || vm.tracksListMode === 3) {
        //             more = getTracks(currentPage);
        //         } else {
        //             more = getSearchTracks(currentPage);
        //         }
        //         more.then(
        //             function (res) {
        //                 for (var i in res.items) {
        //                     if (res.items[i]) {
        //                         $scope.tracksList.push(res.items[i]);
        //                     }
        //                 }

        //                 if (currentPage < res.totalPage) {
        //                     currentPage++;
        //                     vm.isBusy = false;
        //                 }
        //             }
        //         );
        //     }
        // }
    }
})();