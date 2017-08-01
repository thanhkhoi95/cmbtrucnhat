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
                removePlaylistItem: '&',
                showInfo: '&'
            },
            templateUrl: 'app/shared/directives/playlistItem/playlist-item.html'
        };

        playlistItemController.$inject = ['$scope'];

        function playlistItemController($scope) {
            var vm = this;
            vm.track = JSON.parse($scope.track);

            $scope.myShowInfoFunction = function (e){
                e = e || window.event;
                e.stopPropagation();
                $scope.showInfo({trackId: vm.track._id});
                $('#choseTeamModal').modal('toggle');
            };
        }

        return directive;
    }
})();