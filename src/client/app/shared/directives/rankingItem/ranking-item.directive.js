(function () {

    angular
        .module('app.layout')
        .directive('rankingItem', rankingItem);

    /* @ngInject */
    function rankingItem() {
        var directive = {
            controller: rankingItemController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                rank: '@',
                name: '@',
                point: '@',
            },
            templateUrl: 'app/shared/directives/rankingItem/ranking-item.html'
        };

        rankingItemController.$inject = ['$scope'];

        /* @ngInject */
        function rankingItemController($scope) {
            var vm = this;
            $scope.isCollapsed = true;
            vm.rank = $scope.rank;
            vm.name = $scope.name;
            vm.point = $scope.point;
            vm.background = $scope.background;
        }


        return directive;
    }
})();