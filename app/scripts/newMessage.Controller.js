/**
 * @Author: Drop
 * @Creation: 8/2/2016 3:06 PM (The Big Rescue)
 */
(function () {
    var app = angular.module('csgo-radio');

    var newMessageController = ['$scope', '$rootScope', '$mdDialog', function ($scope, $rootScope, $mdDialog) {

        $scope.newMsg = { "italic": false, "bold": false };

        $scope.commands = [{ "cmd": { "Name": "noclip" }, "args": "", "searchText": "noclip" }];

        $scope.dialog = { "advanced": false };

        $scope.cacheResults = true;

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.Name.indexOf(lowercaseQuery) === 0);
            };
        }

        function renderCommand() {
            var output = "";
            for (var command in $scope.commands) {
                if ($scope.commands[command].searchText.length === 0) {
                    continue;
                }
                var args = ($scope.commands[command].args.length > 0) ? " " + $scope.commands[command].args : "";
                output = output + $scope.commands[command].searchText + args + "; ";
            }
            return output;
        }

        $scope.querySearch = function (query) {
            var results = query ? $rootScope.init.commands.filter(createFilterFor(query)) : $rootScope.init.commands;
            return results;
        };

        function findExact(command) {
            var query = $scope.querySearch(command);
            if (query.length > 0 && query.length < 6) {
                for (var item in query) {
                    if (query[item].Name === command) {
                        return query[item];
                    }
                }
            }
            return false;
        }

        function parseCommandLine(commandLine) {
            var commands = commandLine.split(";"), cmdArray = [];
            for (var cmd in commands) {
                if (commands[cmd].length > 0) {//TODO: REDO
                    var split = commands[cmd].split(" ");
                    if (split.length === 1 && split[0].length > 0) {//single command
                        var cmdInfo = findExact((skipfirst === true) ? split[1] : split[0]);
                        cmdArray.push({ "cmd": cmdInfo, "args": (cmdInfo.Value.length > 0) ? cmdInfo.Value : "", "searchText": split[0] })
                    } else {
                        var skipfirst = (split[0] === " " || split[0] === "  " || split[0] === "") ? true : false;
                        var args = (skipfirst === true) ? commands[cmd].replace(split[0] + split[1], "") : commands[cmd].replace(split[0], "");
                        if (args.charAt(0) === " ") {
                            args = args.substring(1);
                        }
                        var cmdInfo = findExact((skipfirst === true) ? split[1] : split[0]);
                        cmdArray.push({ "cmd": cmdInfo, "args": args, "searchText": (skipfirst === true) ? split[1] : split[0] })
                    }
                }

            }
            return cmdArray;
        }

        function create(message) {
            message.UID = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
            message.type = 'custom';
            message.disabled = false;
            message.label = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            $rootScope.model.custom[message.UID] = message;
        }

        $scope.checkArg = function (index) {
            if ($scope.commands[index].args.length === 0 && $scope.commands[index].cmd.Value.length > 0) {
                $scope.commands[index].args = $scope.commands[index].cmd.Value;
            }
        };

        $scope.togAdv = function () {
            console.log("togAdv, " + $scope.dialog.advanced)
            if ($scope.dialog.advanced === true) {
                $scope.newMsg.rawCommand = renderCommand();
                $scope.newMsg.rawCommandBefore = renderCommand();
            } else {
                if ($scope.newMsg.rawCommand !== $scope.newMsg.rawCommandBefore) {
                    $scope.commands = parseCommandLine($scope.newMsg.rawCommand);
                    console.log($scope.commands);
                }

            }
        };

        $scope.togI = function () {
            $scope.newMsg.italic = !$scope.newMsg.italic;
        };

        $scope.togB = function () {
            $scope.newMsg.bold = !$scope.newMsg.bold;
        };

        $scope.addField = function () {
            $scope.commands.push({ "cmd": "", "args": "" });
        };

        $scope.hide = function () {
            $mdDialog.hide();
            $scope.$destroy();
            console.log($rootScope.init);
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
            $scope.$destroy();
            console.log($rootScope.init);
        };
        $scope.create = function (answer) {
            create($scope.newMsg);
            $mdDialog.hide(answer);
            $scope.$destroy();
        };
    }];

    app.controller('newMessageController', newMessageController);
} ());
