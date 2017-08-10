angular.module('app.admin')
    .component('singer', {
        templateUrl: 'app/components/admin/singer/singer.html',
        controller: singerController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            numOfSingers: '=',
            currentArtistIndex: '=',
            singersList: '=',
            changeCurrentArtistIndex: '&'
        }
    });

singerController.$inject = ['$scope', '$q', '$http', '$state'];

function singerController($scope, $q, $http, $state) {
    var vm = this;

    vm.loadMore = loadMore;
    vm.changeView = changeView;
    vm.refresh = refresh;
    vm.changeListMode = changeListMode;
    vm.searchArtist = searchArtist;


    vm.listMode = 0;
    vm.isBusy = false;
    vm.pageSize = 100;
    vm.currentPage = 1;
    vm.search = {
        searchString: ''
    };
    vm.title = 'Artist list (a-z)';

    function searchArtist() {
        if (!vm.search.searchString || vm.search.searchString === '') {
            return;
        }
        $('#artistSearchModal').modal('hide');
        vm.listMode = 2;
        vm.title = 'Search\'s result';
        refresh();
    }

    function changeListMode(mode) {
        if (vm.listMode !== mode) {
            vm.listMode = mode;
            if (mode === 0) {
                vm.title = 'Artist list (a-z)';
            } else if (mode === 1) {
                vm.title = 'Artist rank list';
            }
            refresh();
        }
    }

    function changeView(i) {
        vm.changeCurrentArtistIndex({index: i});
        vm.subState[1] = 1;
    }   

    function getSingers(pageIndex) {
        var deferred = $q.defer();
        var url;
        url = '/api/artist?pageIndex=';
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

    function getTopSingers(pageIndex) {
        var deferred = $q.defer();
        var url;
        url = '/api/artist/top?pageIndex=';
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

    function getSearchSingers(pageIndex) {
        var deferred = $q.defer();
        $http.post('/api/artist/search?pageIndex=' + pageIndex + '&pageSize=' + vm.pageSize, vm.search).then(
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
        vm.singersList = [];
        loadMore(true);
    }

    function loadMore(urgent) {
        if (!vm.isBusy || urgent) {
            vm.isBusy = true;
            var more;
            if (vm.listMode === 0) {
                more = getSingers(vm.currentPage);
            } else if (vm.listMode === 1) {
                more = getTopSingers(vm.currentPage);
            } else if (vm.listMode === 2) {
                more = getSearchSingers(vm.currentPage);
            }
            more.then(
                function (res) {
                    vm.numOfSingers = res.totalItems;
                    for (var i in res.items) {
                        if (res.items[i]) {
                            if (res.items[i].birthdate) {
                                res.items[i].birthdate = moment(res.items[i].birthdate).format('MM/DD/YYYY');
                            }
                            vm.singersList.push(res.items[i]);
                        }
                    }
                    if (vm.currentPage < res.totalPage) {
                        vm.currentPage++;
                        vm.isBusy = false;
                    }
                }
            );
        }
    }
}
