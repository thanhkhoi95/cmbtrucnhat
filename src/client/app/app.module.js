(function () {
    'use strict';

    angular.module('app', [
        'app.layout',
        'app.homepage',

        'ui.router',
        'angular-jwt',
        'ngStorage',
        'ngAnimate',
        'ngSanitize',
        'ngplus',
        'blocks.exception',
        'blocks.logger',
        'blocks.router',
        'infinite-scroll',
        'ui.sortable'
    ]);

})();