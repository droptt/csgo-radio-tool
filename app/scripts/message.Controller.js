/**
 * @Author: Drop
 * @Creation: 7/26/2016 2:46 PM (Polyjuice Potion)
 */
(function () {
    var app = angular.module('csgo-radio');

    var messageController = function ($scope, $rootScope, $filter) {
        $scope.isMessage = function (message) {
            return typeof message === 'string' ? true : false;
        };
        $scope.removeMessage = function (list, message, index) {
            if ($scope.isMessage(message) === true) {
                $rootScope.model.messages[message].disabled = false;
                $rootScope.model[list].splice(index, 1);
            }
        };
        $scope.checkLimit = function (event, index, item) {
            if (event.target.attributes[0].nodeName === 'data-list-name') { //Checks if target is the list
                var targetName = event.target.attributes[0].nodeValue;
            } else if (event.target.parentNode.attributes[0].nodeName === 'data-list-name') { //In case element wasn't dropped on the list
                var targetName = event.target.parentNode.attributes[0].nodeValue;
            } else if (event.target.parentNode.parentNode.attributes[0].nodeName === 'data-list-name') { //Never trust the user, they said.
                var targetName = event.target.parentNode.parentNode.attributes[0].nodeValue;
            }
            if ($rootScope.model[targetName].length > 8) {
                return false;
            }
            return item;
        };
    }
    app.controller('messageController', messageController);
} ());
