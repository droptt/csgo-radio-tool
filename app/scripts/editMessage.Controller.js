/**
 * @Author: Drop
 * @Creation: 7/29/2016 3:10 PM (The Duel of the Fates)
 */
(function () {
    var app = angular.module('csgo-radio');

    var editMessageModalController = ['$scope', '$rootScope', 'list', 'message', 'index', 'messagesService', function ($scope, $rootScope, list, message, index, messagesService) {
        if (message.type === 'custom') {
            $scope.edit = {};
            $scope.edit.command = $rootScope.model.custom[message.UID].cmd;
            $scope.edit.label = $rootScope.model.custom[message.UID].text;
            $scope.edit.italic = (typeof $rootScope.model.custom[message.UID].italic == 'undefined') ? false : $rootScope.model.custom[message.UID].italic;
            $scope.edit.bold = (typeof $rootScope.model.custom[message.UID].bold == 'undefined') ? false : $rootScope.model.custom[message.UID].bold;
        } else {
            $scope.edit = {};
            $scope.edit.command = message.cmd;
            $scope.edit.label = message.text;
            $scope.edit.italic = (typeof message.italic == 'undefined') ? false : message.italic;
            $scope.edit.bold = (typeof message.bold == 'undefined') ? false : message.bold;
            $scope.edit.copyBtn = true;
        }

        function saveChanges() {
            if (message.type === 'custom') {
                $rootScope.model.custom[message.UID].cmd = $scope.edit.command;
                $rootScope.model.custom[message.UID].text = $scope.edit.label;
                $rootScope.model.custom[message.UID].italic = $scope.edit.italic;
                $rootScope.model.custom[message.UID].bold = $scope.edit.bold;
                if ($rootScope.model.custom[message.UID].disabled === true && list !== 'custom') { //copy of it somewhere, must find the precious!
                    var messageCopy = $rootScope.model[list].filter(function (messageCopy) {
                        return messageCopy.UID === message.UID;
                    })[0];
                    if (typeof messageCopy == 'undefined') { //That's not supposed to happen.
                        return false; //TODO: tell the user
                    }
                    messageCopy.cmd = $scope.edit.command;
                    messageCopy.text = $scope.edit.label;
                    messageCopy.italic = $scope.edit.italic;
                    messageCopy.bold = $scope.edit.bold;
                } else if ($rootScope.model.custom[message.UID].disabled === true) {
                    var lists = ['standard', 'group', 'report'];
                    for (var msgGroup in lists) {
                        var messageCopy = $rootScope.model[msgGroup].filter(function (messageCopy) {
                            return messageCopy.UID === message.UID;
                        })[0];
                        if (typeof messageCopy == 'undefined') { //That's not supposed to happen.
                            continue;
                        } else {
                            messageCopy.cmd = $scope.edit.command;
                            messageCopy.text = $scope.edit.label;
                            messageCopy.italic = $scope.edit.italic;
                            messageCopy.bold = $scope.edit.bold;
                        }
                    }
                }
            }
            if (message.type === 'imported') {
                message.cmd = $scope.edit.command;
                message.text = $scope.edit.label;
                message.italic = $scope.edit.italic;
                message.bold = $scope.edit.bold;
            }
            $scope.edit = false;
            if($rootScope.settings.shared === true) {
                messagesService.saveHash();
            } else {
                messagesService.save();
            }
        }

        $scope.copy = function () {
            message.UID = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
            message.type = 'custom';
            $scope.edit.copyBtn = false;
            $rootScope.model.custom[message.UID] = message;
            $rootScope.model.custom[message.UID].disabled = true;
        }

        $scope.cancel = function () {
            $scope.edit = false;
            $uibModalInstance.close('cancel');
        };

        $scope.save = function () {
            saveChanges();
            $uibModalInstance.close('ok');
        };
    }];

    app.controller('editMessageModalController', editMessageModalController);
} ());
