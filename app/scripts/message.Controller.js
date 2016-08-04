/**
 * @Author: Drop
 * @Creation: 7/26/2016 2:46 PM (Polyjuice Potion)
 */
(function () {
    var app = angular.module('csgo-radio');

    var messageController = ['$scope', '$rootScope', '$uibModal', '$filter', function ($scope, $rootScope, $uibModal, $filter) {
        $scope.isMessage = function (message) {
            if (typeof message === 'string') {
                return true;
            } else {
                if (message.type === 'imported') {
                    return message.type;
                } else {
                    return false;
                }
            }
        };
        $scope.removeMessage = function (list, message, index) {
            if ($scope.isMessage(message) === true) {
                $rootScope.model.messages[message].disabled = false;
                $rootScope.model[list].splice(index, 1);
            } else {
                if (message.type === 'custom') {
                    $rootScope.model.custom[message.UID].disabled = false;
                    $rootScope.model[list].splice(index, 1);
                } else {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'prompt-modal.html',
                        controller: 'promptController',
                        resolve: {
                            action: function () {
                                return "deleteImportedCommand";
                            },
                            extra: function () {
                                return { list: list, message: message, index: index };
                            }
                        }
                    });
                }
            }
        };
        $scope.editMessage = function (list, message, index) {
            if ($rootScope.model.custom.hasOwnProperty(message.UID) === true) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'edit-message-modal.html',
                    controller: 'editMessageModalController',
                    resolve: {
                        list: function () {
                            return list;
                        },
                        message: function () {
                            return message;
                        },
                        index: function () {
                            return index;
                        }
                    }
                });
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
            console.log(targetName);
            if ($rootScope.model[targetName].length > 8) {
                return false;
            }
            return item;
        };
    }];
    app.controller('messageController', messageController);
} ());
