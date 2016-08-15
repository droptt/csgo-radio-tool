/**
 * @Author: Drop
 * @Creation: 8/2/2016 3:06 PM (The Big Rescue)
 */
(function () {
    var app = angular.module('csgo-radio');

    var newMessageController = ['$scope', '$rootScope', '$mdDialog', 'list', 'message', 'index', 'messageService', function ($scope, $rootScope, $mdDialog, list, message, index, messageService) { //This is for creation and editing.
        $scope.dialog = { 'advanced': false };
        if (typeof list == 'undefined' && typeof message == 'undefined' && typeof list == 'undefined') { //Creation Mode
            $scope.message = { 'italic': false, 'bold': false, 'color': '' };

            $scope.commands = [{ 'cmd': { 'Name': 'noclip' }, 'args': '', 'searchText': 'noclip' }];
            var New = true;
            $scope.mode = 'new';
        } else {
            if (message.type === 'custom') {
                $scope.message = {
                    'italic': (typeof $rootScope.model.custom[message.UID].italic == 'undefined') ? false : $rootScope.model.custom[message.UID].italic,
                    'bold': (typeof $rootScope.model.custom[message.UID].bold == 'undefined') ? false : $rootScope.model.custom[message.UID].bold,
                    'label': $rootScope.model.custom[message.UID].text,
                    'UID': message.UID
                };

                $scope.commands = messageService.parseCommandLine($rootScope.model.custom[message.UID].cmd);
            } else {
                $scope.message = {
                    'italic': (typeof message.italic == 'undefined') ? false : message.italic,
                    'bold': (typeof message.bold == 'undefined') ? false : message.bold,
                    'label': message.text,
                    'color': message.color
                };

                $scope.commands = messageService.parseCommandLine(message.cmd);
                $scope.dialog.copyBtn = true;
            }
            var New = false;
            $scope.mode = 'edit';
        }

        $scope.dialog.colorpickeroptions = {
            label: 'Choose a color',
            default: '#000000',
            genericPalette: false,
            history: true,
            rgb: false,
            hsl: false
        };

        $scope.cacheResults = true;

        $scope.debug = function () {
            console.log($scope.commands)
            console.log($scope.message)
            console.log($rootScope.model)
        };
        $scope.querySearch = function (query) {
            var results = query ? $rootScope.init.commands.filter(messageService.newFilter(query)) : $rootScope.init.commands;
            return results;
        };

        $scope.checkArg = function (index) {
            if ($scope.commands[index].args.length === 0 && $scope.commands[index].cmd !== null) {
                if (typeof $scope.commands[index].cmd.Value !== 'undefined') {
                    $scope.commands[index].args = $scope.commands[index].cmd.Value;
                }
            }
        };

        $scope.togAdv = function () {
            console.log('togAdv, ' + $scope.dialog.advanced)
            if ($scope.dialog.advanced === true) {
                $scope.message.rawCommand = messageService.renderCommand($scope.commands);
                $scope.message.rawCommandBefore = messageService.renderCommand($scope.commands);
            } else {
                if ($scope.message.rawCommand !== $scope.message.rawCommandBefore) {
                    $scope.commands = messageService.parseCommandLine($scope.message.rawCommand);
                }

            }
        };

        $scope.togI = function () {
            $scope.message.italic = !$scope.message.italic;
        };

        $scope.togB = function () {
            $scope.message.bold = !$scope.message.bold;
        };

        $scope.addField = function () {
            $scope.commands.push({ 'cmd': '', 'args': '' });
        };

        $scope.hide = function () {
            $mdDialog.hide();
            $scope.$destroy();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
            $scope.$destroy();
        };
        $scope.confirm = function (answer) {
            if (New === true) {
                messageService.newMessage($scope.message, $scope.commands);
            } else {
                messageService.saveEdit($scope.message, message, $scope.commands, list);
            }
            $mdDialog.hide(answer);
            $scope.$destroy();
        };
    }];

    app.controller('newMessageController', newMessageController);
} ());
