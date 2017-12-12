/**
 * @Author: Drop
 * @Creation: 7/26/2016 2:46 PM (Polyjuice Potion)
 */
(function () {
    var app = angular.module('csgo-radio');

    var messageController = ['$scope', '$rootScope', 'uiService', function ($scope, $rootScope, uiService) {
        $scope.removeMessage = function (list, message, index, ev) {
            if (message.type === 'message') {
                $rootScope.model.messages[message.cmd].disabled = false;
                $rootScope.model[list].splice(index, 1);
            } else {
                if (message.type === 'custom') {
                    $rootScope.model.custom[message.UID].disabled = false;
                    $rootScope.model[list].splice(index, 1);
                } else {
                    uiService.Confirm.deleteImportedCommand(ev, list, message, index);
                }
            }
        };
        $scope.checkLimit = function (event, index, item) {
            if (event.target.attributes[0].nodeName === 'data-list-name') { //Checks if target is the list
                var targetName = event.target.attributes[0].nodeValue;
            } else if (event.target.parentNode.attributes[0].nodeName === 'data-list-name') { //In case element was dropped in a child
                var targetName = event.target.parentNode.attributes[0].nodeValue;
            } else if (event.target.parentNode.parentNode.attributes[0].nodeName === 'data-list-name') { //Never trust the user, they said.
                var targetName = event.target.parentNode.parentNode.attributes[0].nodeValue;
            } else if (event.target.parentNode.parentNode.parentNode.attributes[0].nodeName === 'data-list-name') { //In case somebody drops into the pull left
                var targetName = event.target.parentNode.parentNode.parentNode.attributes[0].nodeValue;
            } else if (event.target.parentNode.parentNode.parentNode.parentNode.attributes[0].nodeName === 'data-list-name') { //Or the button
                var targetName = event.target.parentNode.parentNode.parentNode.parentNode.attributes[0].nodeValue;
            }
            if (item.type === 'message') {
                delete item.id;
                delete item.label;
                delete item.text;
            }
            if ($rootScope.model[targetName].indexOf(item) !== -1) {
                return item;
            }
            if ($rootScope.model[targetName].length > 8) {
                return false;
            }
            return item;
        };
    }];
    app.controller('messageController', messageController);
} ());
