(function () {

  'use strict';

  angular.module('services.errorTranslator', [])
    .factory('errTransService', function () {
      var errorTranslator = {
        'ERROR_INPUT': 'Invalid input fields',
        'SYSTEM_ERROR': 'Please try again',
        'USER_NOT_FOUND': 'Wrong email or password',
        'PASSWORD_INCORRECT': 'Wrong email or password',
        'DUPPLICATE_TEAM': 'Team\'s already existed'
      };
      return errorTranslator;
    });
})();
