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
            singersList: '='
        }
    });

singerController.$inject = ['$scope', '$q', '$http', '$state'];

function singerController($scope, $q, $http, $state) {
    var vm = this;
    vm.isBusy = false;
    vm.singersListMode = 0;
    vm.pageSize = 100;
    vm.currentPage = 1;
    vm.loadMore = loadMore;
    vm.changeView = changeView;

    function changeView(index) {
        vm.subState = 1;
        vm.currentArtistIndex = index;
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

    function loadMore(urgent) {
        if (!vm.isBusy || urgent) {
            vm.isBusy = true;
            var more;
            if (vm.singersListMode === 0) {
                more = getSingers(vm.currentPage);
            } else {
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
