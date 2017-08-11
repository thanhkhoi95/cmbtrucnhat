angular.module('app.admin')
    .component('composerItem', {
        templateUrl: 'app/components/admin/composer/composerItem/composer-item.html',
        controller: composerItemController,
        controllerAs: 'vm',
        bindings: {
            composer: '@',
            rank: '@',
            index: '@'
        }
    });

    composerItemController.$inject = ['$scope'];

function composerItemController($scope) {
    var vm = this;
    vm.myComposer = JSON.parse(vm.composer);
    vm.rankIndex = parseInt(vm.index) + 1;
}