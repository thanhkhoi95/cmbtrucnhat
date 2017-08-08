angular.module('app.admin')
    .component('singerDetail', {
        templateUrl: 'app/components/admin/singerDetail/singer-detail.html',
        controller: singerDetailController,
        controllerAs: 'vm',
        bindings: {
            menu: '=',
            subState: '=',
            currentArtistIndex: '=',
            singersList: '='
        }
    });

singerDetailController.$inject = ['$http', '$q'];

function singerDetailController($http, $q) {
    var vm = this;

    var newArtist = {
        name: '',
        birthdate: undefined,
        detailInformation: undefined
    };

    vm.save = save;
    vm.reset = reset;

    reset();

    function save() {
        var updatedArtist = JSON.parse(JSON.stringify(vm.currentArtistIndex));
        if (vm.currentArtistIndex > -1) {
            if (vm.currentArtist.birthdate instanceof Date && !isNaN(vm.currentArtist.birthdate.valueOf())) {
                vm.currentArtist.birthdate = vm.currentArtist.birthdate.toISOString();
            } else vm.currentArtist.birthdate = undefined;
            var deferred = $q.defer();
            if (vm.currentArtist.detailInformation === '') vm.currentArtist.detailInformation = undefined;
            $http.put('/api/artist', vm.currentArtist).then(
                function successCallback(response) {
                    deferred.resolve(response.data);
                    console.log(response.data);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }
    }

    function reset() {
        if (vm.currentArtistIndex > -1) {
            vm.currentArtist = JSON.parse(JSON.stringify(vm.singersList[vm.currentArtistIndex]));
        } else {
            vm.currentArtist = JSON.parse(JSON.stringify(newArtist));
        }
    }

}
