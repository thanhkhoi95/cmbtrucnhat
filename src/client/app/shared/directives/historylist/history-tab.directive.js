(function () {
    'use strict';

    angular.module('app.profile')
        .directive('historyTab', historyTab);

    /* @ngInject */
    function historyTab() {
        var directive = {
            restrict: 'EA',
            scope: {
                history: '=',
            },
            templateUrl: 'app/shared/directives/historylist/history-tab.html'
        };

        return directive;
    }
})();