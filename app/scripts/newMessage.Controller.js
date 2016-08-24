/**
 * @Author: Drop
 * @Creation: 8/2/2016 3:06 PM (The Big Rescue)
 */
(function () {
    var app = angular.module('csgo-radio');

    var newMessageController = ['$scope', '$rootScope', '$mdDialog', 'list', 'message', 'index', 'messageService', 'uiService', function ($scope, $rootScope, $mdDialog, list, message, index, messageService, uiService) { //This is for creation and editing.
        function requirements() {
            $scope.requirements = { "cheats": false, "dev": false, "sponly": false };
            for (var command in $scope.commands) {
                if ($scope.commands[command].cmd === null) { continue; }
                if (typeof $scope.commands[command].cmd.ch !== 'undefined' && $scope.requirements.cheats === false) { $scope.requirements.cheats = true; }
                if (typeof $scope.commands[command].cmd.do !== 'undefined' && $scope.requirements.dev === false) { $scope.requirements.dev = true; }
                if (typeof $scope.commands[command].cmd.sp !== 'undefined' && $scope.requirements.sponly === false) { $scope.requirements.sponly = true; }
                if (typeof $scope.commands[command].cmd.cd !== 'undefined' && $scope.requirements.client === false) { $scope.requirements.client = true; }
                if (typeof $scope.commands[command].cmd.gl !== 'undefined' && $scope.requirements.server === false) { $scope.requirements.server = true; }
            }
        }
        $scope.dialog = { 'advanced': false };
        if (typeof list == 'undefined' && typeof message == 'undefined' && typeof list == 'undefined') { //Creation Mode
            $scope.message = { 'label': '', 'italic': false, 'bold': false, 'color': '#000000' };

            $scope.commands = [{ 'cmd': { 'Name': 'noclip' }, 'args': '', 'searchText': 'noclip' }];

            $scope.requirements = { "cheats": true, "dev": false, "sponly": false };
            var New = true;
            $scope.mode = 'new';
        } else {
            if (message.type === 'custom') {
                $scope.message = {
                    'italic': (typeof $rootScope.model.custom[message.UID].italic == 'undefined') ? false : $rootScope.model.custom[message.UID].italic,
                    'bold': (typeof $rootScope.model.custom[message.UID].bold == 'undefined') ? false : $rootScope.model.custom[message.UID].bold,
                    'label': $rootScope.model.custom[message.UID].text,
                    'color': $rootScope.model.custom[message.UID].color,
                    'UID': message.UID
                };

                $scope.custom = true;
                $scope.commands = messageService.parseCommandLine($rootScope.model.custom[message.UID].cmd);
            } else {
                $scope.message = {
                    'italic': (typeof message.italic == 'undefined') ? false : message.italic,
                    'bold': (typeof message.bold == 'undefined') ? false : message.bold,
                    'label': message.text,
                    'color': message.color
                };

                $scope.custom = false;
                $scope.commands = messageService.parseCommandLine(message.cmd);
                $scope.dialog.copyBtn = true;
            }
            requirements();
            var New = false;
            $scope.mode = 'edit';
        }


        $scope.dialog.colorpickeroptions = {
            label: 'Choose a color',
            default: '#000000',
            genericPalette: false,
            preview: false,
            history: true,
            rgb: false,
            clearButton: true,
            hsl: false
        };

        $scope.cacheResults = true;

        $scope.autocomplete = $rootScope.init.Commands;

        $scope.querySearch = function (query) {
            if ($rootScope.init.Commands === true) {
                var results = query ? $rootScope.init.commands.filter(messageService.newFilter(query)) : $rootScope.init.commands;
                return results;
            }
            return [];
        };

        $scope.checkArg = function (index) {
            if ($scope.commands[index].args.length === 0 && $scope.commands[index].cmd !== null) {
                if (typeof $scope.commands[index].cmd.Value !== 'undefined') {
                    $scope.commands[index].args = $scope.commands[index].cmd.Value;
                }
            }
            requirements();
        };

        $scope.togAdv = function () {
            if ($scope.dialog.advanced === true) {
                $scope.message.rawCommand = messageService.renderCommand($scope.commands);
                $scope.message.rawCommandBefore = messageService.renderCommand($scope.commands);
            } else {
                if ($scope.message.rawCommand !== $scope.message.rawCommandBefore) {
                    $scope.commands = messageService.parseCommandLine($scope.message.rawCommand);
                    requirements();
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
            $scope.commands.push({ 'cmd': '', 'args': '', 'searchText': '' });
        };

        $scope.deleteM = function (ev) {
            if (message.type === 'custom') {
                uiService.Confirm.deleteCustomCommand(ev, message, list, $mdDialog);
            }
        };

        $scope.hide = function () {
            $mdDialog.hide();
            $scope.$destroy();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
            $scope.$destroy();
        };
        $scope.confirm = function () {
            if (Object.keys($scope.cmdName.label.$error).length > 0) {
                $scope.selected = 0;
                $scope.cmdName.$submitted = true;
            } else {
                if (New === true) {
                    messageService.newMessage($scope.message, $scope.commands);
                } else {
                    console.log($scope.message)
                    messageService.saveEdit($scope.message, message, $scope.commands, list);
                }
                $mdDialog.hide();
                $scope.$destroy();
            }
        };
    }];

    app.controller('newMessageController', newMessageController);
} ());
