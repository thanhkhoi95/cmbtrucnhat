(function () {
    'use strict';

    angular.module('app.homepage')
        .directive('infoTab', infoTab);

    /* @ngInject */
    function infoTab() {
        var directive = {
            restrict: 'EA',
            scope: {
                team: '=',
                accept: '&',
            },
            templateUrl: 'app/shared/directives/infoTab/info-tab.html'
        };

        return directive;
    }
})();