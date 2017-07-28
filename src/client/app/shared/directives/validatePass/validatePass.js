angular.module('app')
    .directive('validatePass', validatePass);

function validatePass() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            function validateEqual(value) {
                var valid = (value === scope.$eval(attrs.validatePass));
                ngModelCtrl.$setValidity('equals', valid);
                return valid ? value : undefined;
            }
            ngModelCtrl.$parsers.push(validateEqual);
            ngModelCtrl.$formatters.push(validateEqual);

            scope.$watch(attrs.validatePass, function() {
                ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
            });
        }
    };
}