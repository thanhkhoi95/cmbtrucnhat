(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('dayOfWeek', dayOfWeek);

    /* @ngInject */
    function dayOfWeek() {
        var directive = {
            restrict: 'EA',
            link: link,
            templateUrl: 'app/shared/directives/dayOfWeek/day-of-week.html'
        };
        function link(scope, element, attrs) {
            var day = attrs.dayOfWeek;
            element.find('.' + day).addClass('active');
        }

        return directive;
    }
})();