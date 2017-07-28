(function () {

    angular.module('app.team')
        .directive('messageTab', messageTab);

    /* @ngInject */
    function messageTab() {
        var directive = {
            controller: messageTabController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                type: '@',
                abc: '@',
            },
            template: '<div ng-include="vm.contentUrl"></div>'
        };
        messageTabController.$inject = ['$scope'];
        function messageTabController($scope) {
            var vm = this;
            vm.contentUrl = 'app/shared/directives/messageTab/';
            vm.showDetail = false;
            if ($scope.type === 'challenge') {
                vm.contentUrl += 'challenge.html';
            } else {
                vm.contentUrl += 'notification.html';
            }

        }
        return directive;
    }
})();