angular.module('app.admin')
    .controller('adminController', adminController);

    adminController.$inject =['$state', 'authService'];

function adminController($state, authService) {
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
    vm.songsList = [];
    vm.currentSong;
    vm.currentArtist;
    vm.currentMusician;
    vm.changeCurrentArtistIndex = changeCurrentArtistIndex;
    vm.changeCurrentMusicianIndex = changeCurrentMusicianIndex;
    vm.changeCurrentMusicIndex = changeCurrentMusicIndex;
    vm.setCurrentSongArtist = setCurrentSongArtist;
    vm.setCurrentSongMusician = setCurrentSongMusician;
    vm.setCurrentArtist = setCurrentArtist;
    vm.setCurrentMusician = setCurrentMusician;
    vm.logout = logout;

    function logout() {
        toastr.success(authService.logout());
        $state.go('auth.login');
    }

    function changeMenu(state) {
        if (vm.menu !== state) {
            vm.menu = state;
            vm.subState[(state + 1) % 3] = 0;
            vm.subState[(state + 2) % 3] = 0;
            if (state !== 0) vm.subState[state] = 0;
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

    function setCurrentSongArtist(artist) {
        vm.currentSong.artist = artist;
    }

    function setCurrentSongMusician(musician) {
        vm.currentSong.musician = musician;
    }

    function setCurrentArtist(artist) {
        vm.currentArtist = artist;
    }

    function setCurrentMusician(musician) {
        vm.currentMusician = musician;
        console.log(vm.currentMusician);
    }

}
