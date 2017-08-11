angular.module('app.admin')
    .component('song', {
        templateUrl: 'app/components/admin/song/song.html',
        controller: songController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            numOfSongs: '=',
            currentSongIndex: '=',
            songsList: '=',
            changeCurrentMusicIndex: '&'
        }
    });

songController.$inject = ['$scope', '$q', '$http', '$state'];

function songController($scope, $q, $http, $state) {
    var vm = this;

    vm.loadMore = loadMore;
    vm.changeView = changeView;
    vm.refresh = refresh;
    vm.changeListMode = changeListMode;
    vm.searchSong = searchSong;


    vm.listMode = 0;
    vm.isBusy = false;
    vm.pageSize = 100;
    vm.currentPage = 1;
    vm.search = {
        searchString: ''
    };
    vm.title = 'Song list (a-z)';

    function changeListMode(mode) {
        if (vm.listMode !== mode) {
            vm.listMode = mode;
            if (mode === 0) {
                vm.title = 'Song list (a-z)';
            } else if (mode === 1) {
                vm.title = 'Song rank list';
            }
            refresh();
        }
    }

    function changeView(i) {
        vm.changeCurrentMusicIndex({ index: i });
        vm.subState[0] = 1;
    }

    function searchSong() {
        vm.search.type = $('input[name="searchType"]:checked').val();
        vm.search.filter = $('input[name="searchFilter"]:checked').val();
        if (!vm.search.searchString || vm.search.searchString === '') return;
        $('#songSearchModal').modal('hide');
        vm.listMode = 2;
        vm.title = 'Search\'s result';
        refresh();
    }

    function getSongs(pageIndex) {
        var deferred = $q.defer();
        var url;
        if (vm.listMode === 1) {
            url = '/api/music/getpopular?pageIndex=';
        } else if (vm.listMode === 0) {
            url = '/api/music/getaz?pageIndex=';
        }
        $http({
            method: 'GET',
            url: url + pageIndex + '&pageSize=' + vm.pageSize
        }).then(function successCallback(response) {
            deferred.resolve(response.data);
        }, function () {
            deferred.reject(null);
        });
        return deferred.promise;
    }

    function getSearchSongs(pageIndex) {
        var deferred = $q.defer();
        $http.post('/api/music/search?pageIndex=' + pageIndex + '&pageSize=' + vm.pageSize, vm.search).then(
            function successCallback(response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            }
        );
        return deferred.promise;
    }

    function refresh() {
        vm.currentPage = 1;
        vm.songsList = [];
        loadMore(true);
    }

    function loadMore(urgent) {
        if (!vm.isBusy || urgent) {
            vm.isBusy = true;
            var more;
            if (vm.listMode <= 1) {
                more = getSongs(vm.currentPage);
            } else if (vm.listMode === 2) {
                more = getSearchSongs(vm.currentPage);
            }
            more.then(
                function (res) {
                    vm.numOfSongs = res.totalItems;
                    for (var i in res.items) {
                        if (res.items[i]) {
                            vm.songsList.push(res.items[i]);
                        }
                    }
                    console.log(vm.songsList);
                    if (vm.currentPage < res.totalPage) {
                        vm.currentPage++;
                        vm.isBusy = false;
                    }
                }
            );
        }
    }
}
