(function () {

  angular.module('services.auth', ['ngStorage', 'services.errorTranslator'])
    .factory('authService', ['$q', '$http', '$localStorage', '$sessionStorage', 'jwtHelper', 'errTransService', authService]);

  function authService($q, $http, $localStorage, $sessionStorage, jwtHelper, errTransService) {

    var storage;

    function login(request, state) {
      var deferred = $q.defer();

      if (state === 1) {
        storage = $localStorage;
      } else if (state === 0) {
        storage = $sessionStorage;
      } else if (state === 2) {
        if ($localStorage.token) {
          $localStorage.user = jwtHelper.decodeToken($localStorage.token);
          return true;
        } else if ($sessionStorage.token) {
          $sessionStorage.user = jwtHelper.decodeToken($sessionStorage.token);
          return true;
        }
        return false;
      }

      $http.post('api/auth/signin', request)
        .then(function (res) {
          storage.token = res.data.token;
          storage.user = jwtHelper.decodeToken(res.data.token);
          deferred.resolve('Login successful');
        }, function (err) {
          deferred.reject(errTransService[err.data.message]);
        });

      return deferred.promise;
    }

    function register(newUser) {
      var deferred = $q.defer();
      if (newUser) {
        $http.post('api/auth/signup', newUser)
          .then(function (res) {
            deferred.resolve('Register successful');
          }, function (err) {
            deferred.reject(errTransService[err.data.message]);
          });
      }
      return deferred.promise;
    }

    function teamRegister(newTeam) {
      var token = new getToken();
      var owner = {
        userId: token._id,
        role: 'OWNER',
        position: token.position,
        phone: token.phone,
        email: token.email,
        firstname: token.firstname,
        lastname: token.lastname
      }
      newTeam.owner = owner;

      var deferred = $q.defer();
      if (newTeam) {
        $http.post('api/team/create', newTeam)
          .then(function (res) {
            deferred.resolve('Register successful');
          }, function (err) {
            deferred.reject(errTransService[err.data.message]);
          });
      }
      return deferred.promise;
    }

    function logout() {
      delete $localStorage.token;
      delete $sessionStorage.token;
      delete $localStorage.user;
      delete $sessionStorage.user;
      return 'Logout successful';
    }

    function sendMail(email) {
      var deferred = $q.defer();
      if (email) {
        $http.post('api/auth/sendEmail', email)
          .then(function (res) {
            deferred.resolve('Sent');
          }, function (err) {
            deferred.reject(errTransService[err.data.message]);
          });
      }
      return deferred.promise;
    }

    function resetPassword(request) {
      var deferred = $q.defer();
      if (request) {
        $http.post('api/auth/resetPassword', request)
          .then(function (res) {
            deferred.resolve('Changed successfully');
          }, function (err) {
            deferred.reject(errTransService[err.data.message]);
          });
      }
      return deferred.promise;
    }

    function getToken() {
      if ($localStorage.token) {
        return jwtHelper.decodeToken($localStorage.token);

      } else if ($sessionStorage.token) {
        return jwtHelper.decodeToken($sessionStorage.token);

      }
      return false;
    }

    return {
      login: login,
      logout: logout,
      register: register,
      teamRegister: teamRegister,
      storage: storage,
      sendMail: sendMail,
      resetPassword: resetPassword,
      getToken: getToken
    };

  }
})();
