(function () {

    angular.module('app.homepage')
        .directive('infoTab', infoTab);

    /* @ngInject */
    function infoTab() {
        var directive = {
            controller: infoTabController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                track: '@',
                showInfo: '&',
                playNow: '&',
                addToPlaylist: '&'
            },
            templateUrl: 'app/shared/directives/infoTab/info-tab.html'
        };

        infoTabController.$inject = ['$scope'];

        function infoTabController($scope) {
            var vm = this;
            vm.track = JSON.parse($scope.track);
            if (!vm.track.artist) {
                vm.track.artist = {};
                vm.track.artist.name = 'Unknown';
            }
            if (!vm.track.musician) {
                vm.track.musician = {};
                vm.track.musician.name = 'Unknown';
            }

            $scope.download = function () {
                window.open('/api/music/download?id=' + vm.track._id);
            }
        }

        return directive;
    }
})();