angular.module('app.admin')
    .component('songItem', {
        templateUrl: 'app/components/admin/song/songItem/song-item.html',
        controller: songItemController,
        controllerAs: 'vm',
        bindings: {
            song: '@',
            rank: '@',
            index: '@'
        }
    });

    songItemController.$inject = ['$scope'];

function songItemController($scope) {
    var vm = this;
    vm.mySong = JSON.parse(vm.song);
    vm.rankIndex = parseInt(vm.index) + 1;
}