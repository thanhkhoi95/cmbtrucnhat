angular.module('app.admin')
    .component('singer', {
        templateUrl: 'app/components/admin/singer/singer.html',
        controller: singerController,
        controllerAs: 'vm',
        bindings: {

        }
    });

    singerController.$inject = ['$scope', '$q', '$http', '$state'];

function singerController($scope, $q, $http, $state) {
    var vm = this;
    vm.isBusy = false;
    vm.singersListMode = 0;
    vm.pageSize = 100;
    vm.currentPage = 1;
    vm.singersList = [];
    vm.track = {
        "_id": "59760b350539031018d2778d",
        "name": "Phạm Hồng Phước",
        "detailInformation": "Anh sinh ra thuộc cung Kim Ngưu, anh cầm tinh con (giáp) dê (Tân Mùi 1991). Phạm Hồng Phước xếp hạng nổi tiếng vào thứ 750 ở trên thế giới và xếp hạng thứ 171 ở trong danh sách các Ca sĩ nổi tiếng. Phạm Hồng Phước đã từng tham gia vào trong chương trình Việt Nam Idol của năm 2012, anh từng được đứng ở Top 3 thí sinh được các khán giả bình chọn nhiều nhất nhưng anh lại sớm bị loại.",
        "birthdate": "1991-05-12T17:00:00.000Z",
        "__v": 0
    };
    vm.message = {
        type: 'challenge'

    };


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

    loadMore();

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
                    for (var i in res.items) {
                        if (res.items[i]) {
                            if (res.items[i].birthdate) {
                                res.items[i].birthdate = moment(res.items[i].birthdate).format('DD-MM-YYYY');
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
