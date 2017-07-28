angular.module('app')
    .directive('validateIcon', validateIcon);

function validateIcon() {
    return {
        template: function(elem, attr) {
            return '<i class="fa fa-exclamation-circle" ng-show="register.' + 
            attr.validateIcon + '.$dirty && register.' + 
            attr.validateIcon + '.$invalid" aria-hidden="true"></i>';
        }
    };
}