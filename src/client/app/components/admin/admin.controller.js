angular.module('app.admin')
    .controller('adminController', adminController);

function adminController() {
    var vm = this;

    var newMusician = {
        name: '',
        birthdate: undefined,
        detailInformation: undefined
    };

    vm.menu = 0;
    vm.subState = [0, 0, 0];
    vm.changeMenu = changeMenu;
    vm.numOfSingers = '';
    vm.currentArtistIndex = -1;
    vm.singersList = [];
    vm.numOfComposers = '';
    vm.currentMusicianIndex = -1;
    vm.composersList = [];
    vm.currentMusicIndex = -1;
    vm.songsList =[];
    vm.changeCurrentArtistIndex = changeCurrentArtistIndex;
    vm.changeCurrentMusicianIndex = changeCurrentMusicianIndex;
    vm.changeCurrentMusicIndex = changeCurrentMusicIndex;

    function changeMenu(state) {
        if (vm.menu !== state) {
            vm.menu = state;
            vm.subState[(state + 1) % 3] = 0;
            vm.subState[(state + 2) % 3] = 0;
        }
    }

    function changeCurrentArtistIndex(index) {
        vm.currentArtistIndex = index;
    }

    function changeCurrentMusicianIndex(index) {
        vm.currentMusicianIndex = index;
    }

    function changeCurrentMusicIndex(index) {
        vm.currentMusicIndex = index;
    }

}
