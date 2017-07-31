(function () {

    angular
        .module('app.layout')
        .directive('playlistItem', playlistItem);

    /* @ngInject */
    function playlistItem() {
        var directive = {
            controller: playlistItemController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                track: '@',
                removePlaylistItem: '&'
            },
            templateUrl: 'app/shared/directives/playlistItem/playlist-item.html'
        };

        playlistItemController.$inject = ['$scope'];

        function playlistItemController($scope) {
            var vm = this;
            vm.track = JSON.parse($scope.track);

            $scope.test = function (e){
                e = e || window.event;
                e.stopPropagation();
                console.log(123);
            }
        }

        return directive;
    }
})();