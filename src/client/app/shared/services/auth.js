(function () {

    angular.module('services.auth', ['ngStorage'])
        .factory('authService', ['$q', '$http', '$localStorage', '$sessionStorage', 'jwtHelper', authService]);

    function authService($q, $http, $localStorage, $sessionStorage, jwtHelper) {

        var storage;

        function login(request, state) {
            var deferred = $q.defer();

            if (state === 1) {
                storage = $localStorage;
            } else if (state === 0) {
                storage = $sessionStorage;
            } else if (state === 2) {
                if ($localStorage.welifeToken) {
                    $localStorage.welifeUser = jwtHelper.decodeToken($localStorage.welifeToken);
                    return true;
                } else if ($sessionStorage.welifeToken) {
                    $sessionStorage.welifeUser = jwtHelper.decodeToken($sessionStorage.welifeToken);
                    return true;
                }
                return false;
            }

            $http.post('api/auth/adminLogin', request)
                .then(function (res) {
                    storage.welifeToken = res.data.token;
                    storage.welifeUser = jwtHelper.decodeToken(res.data.token);
                    deferred.resolve('Login successful');
                }, function (err) {
                    deferred.reject('Login failed! Please check your username and password!');
                });

            return deferred.promise;
        }

        function logout() {
            delete $localStorage.welifeToken;
            delete $sessionStorage.welifeToken;
            delete $localStorage.welifeUser;
            delete $sessionStorage.welifeUser;
            return 'Logout successful';
        }

        function getToken() {
            if ($localStorage.welifeToken) {
                return $localStorage.welifeToken;

            } else if ($sessionStorage.welifeToken) {
                return $sessionStorage.welifeToken;

            }
            return false;
        }

        return {
            login: login,
            logout: logout,
            storage: storage,
            getToken: getToken
        };

    }
})();
