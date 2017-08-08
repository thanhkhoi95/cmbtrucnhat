angular.module('app.admin')
    .component('singerItem', {
        templateUrl: 'app/components/admin/singer/singerItem/singer-item.html',
        controller: singerItemController,
        controllerAs: 'vm',
        bindings: {
            singer: '@'
        }
    });

    singerItemController.$inject = ['$scope'];

function singerItemController($scope) {
    var vm = this;
    vm.mySinger = JSON.parse(vm.singer);
}
