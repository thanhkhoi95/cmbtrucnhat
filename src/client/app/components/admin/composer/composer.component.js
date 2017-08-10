angular.module('app.admin')
    .component('composer', {
        templateUrl: 'app/components/admin/composer/composer.html',
        controller: composerController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            numOfComposers: '=',
            currentMusicianIndex: '=',
            composersList: '='
        }
    });

    composerController.$inject = ['$scope', '$q', '$http', '$state'];

function composerController($scope, $q, $http, $state) {
    var vm = this;

    vm.loadMore = loadMore;
    vm.changeView = changeView;
    vm.refresh = refresh;
    vm.changeListMode = changeListMode;
    vm.searchComposer = searchComposer;


    vm.listMode = 0;
    vm.isBusy = false;
    vm.pageSize = 100;
    vm.currentPage = 1;
    vm.search = {
        searchString: ''
    };
    vm.title = 'Composer list (a-z)';

    function searchComposer() {
        if (!vm.search.searchString || vm.search.searchString === '') {
            return;
        }
        $('#composerSearchModal').modal('hide');
        vm.listMode = 2;
        vm.title = 'Search\'s results';
        refresh();
    }

    function changeListMode(mode) {
        if (vm.listMode !== mode) {
            vm.listMode = mode;
            if (mode === 0) {
                vm.title = 'Composer list (a-z)';
            } else if (mode === 1) {
                vm.title = 'Composer rank list';
            }
            refresh();
        }
    }

    function changeView(index) {
        vm.subState[2] = 1;
        vm.currentMusicianIndex = index;
    }

    function getComposers(pageIndex) {
        var deferred = $q.defer();
        var url;
        url = '/api/musician?pageIndex=';
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

    function getTopComposers(pageIndex) {
        var deferred = $q.defer();
        var url;
        url = '/api/musician/top?pageIndex=';
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

    function getSearchComposers(pageIndex) {
        var deferred = $q.defer();
        $http.post('/api/musician/search?pageIndex=' + pageIndex + '&pageSize=' + vm.pageSize, vm.search).then(
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
        vm.composersList = [];
        loadMore(true);
    }

    function loadMore(urgent) {
        if (!vm.isBusy || urgent) {
            vm.isBusy = true;
            var more;
            if (vm.listMode === 0) {
                more = getComposers(vm.currentPage);
            } else if (vm.listMode === 1) {
                more = getTopComposers(vm.currentPage);
            } else if (vm.listMode === 2) {
                more = getSearchComposers(vm.currentPage);
            }
            more.then(
                function (res) {
                    vm.numOfComposers = res.totalItems;
                    for (var i in res.items) {
                        if (res.items[i]) {
                            if (res.items[i].birthdate) {
                                res.items[i].birthdate = moment(res.items[i].birthdate).format('MM/DD/YYYY');
                            }
                            vm.composersList.push(res.items[i]);
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
