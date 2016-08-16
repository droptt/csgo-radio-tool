/**
 * @Author: Drop
 * @Creation: 8/14/2016 6:50 PM (A Whirl Through Academe)
 */
(function () {

    angular.module('csgo-radio').factory('messageService', ['$rootScope', 'messagesService', '$analytics', function ($rootScope, messagesService, $analytics) {

        var querySearch = function (query) {
            if ($rootScope.init.Commands === true) {
                var results = query ? $rootScope.init.commands.filter(this.newFilter(query)) : $rootScope.init.commands;
                return results;
            }
            return false;
        };

        var renderCommand = function (commandArray) {
            var output = '';
            for (var command in commandArray) {
                if (commandArray[command].searchText.length === 0) {
                    continue;
                }
                var args = (commandArray[command].args.length > 0) ? ' ' + commandArray[command].args : '';
                output = output + commandArray[command].searchText + args + '; ';
            }
            return output;
        };

        var saveChanges = function (message, origMessage, commandArray, list) {
            if (origMessage.type === 'custom') {
                $rootScope.model.custom[origMessage.UID].cmd = this.renderCommand(commandArray);
                $rootScope.model.custom[origMessage.UID].text = message.label;
                $rootScope.model.custom[origMessage.UID].italic = message.italic;
                $rootScope.model.custom[origMessage.UID].bold = message.bold;
                $rootScope.model.custom[origMessage.UID].color = message.color;
                if ($rootScope.model.custom[origMessage.UID].disabled === true && list !== 'custom') { //copy of it somewhere, must find the precious!
                    var messageCopy = $rootScope.model[list].filter(function (messageCopy) {
                        return messageCopy.UID === origMessage.UID;
                    })[0];
                    if (typeof messageCopy == 'undefined') { //That's not supposed to happen.
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Could not find the copy of the message.')
                                .position('top right')
                                .hideDelay(7000)
                        );
                        $analytics.eventTrack('Could not find Message clone', {
                            category: 'radio_tool',
                        });
                        return false;
                    }
                    messageCopy.cmd = this.renderCommand(commandArray);
                    messageCopy.text = message.label;
                    messageCopy.italic = message.italic;
                    messageCopy.bold = message.bold;
                    messageCopy.color = message.color;
                } else if ($rootScope.model.custom[origMessage.UID].disabled === true) {
                    var lists = ['standard', 'group', 'report'];
                    for (var msgGroup in lists) {
                        var messageCopy = $rootScope.model[list[msgGroup]].filter(function (messageCopy) {
                            return messageCopy.UID === origMessage.UID;
                        })[0];
                        if (typeof messageCopy == 'undefined') { //That's not supposed to happen.
                            continue;
                        } else {
                            messageCopy.cmd = this.renderCommand(commandArray);
                            messageCopy.text = message.label;
                            messageCopy.italic = message.italic;
                            messageCopy.bold = message.bold;
                            messageCopy.color = message.color;
                        }
                    }
                }
            }
            if (origMessage.type === 'imported') {
                origMessage.cmd = this.renderCommand(commandArray);
                origMessage.text = message.label;
                origMessage.italic = message.italic;
                origMessage.bold = message.bold;
                origMessage.color = message.color;
            }
            if ($rootScope.settings.shared === true) {
                messagesService.saveHash();
            } else {
                messagesService.save();
            }
        };

        var createFilterFor = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.Name.indexOf(lowercaseQuery) === 0);
            };
        };

        var renderCommand = function (commandArray) {
            var output = '';
            for (var command in commandArray) {
                if (commandArray[command].searchText.length === 0) {
                    continue;
                }
                var args = (commandArray[command].args.length > 0) ? ' ' + commandArray[command].args : '';
                output = output + commandArray[command].searchText + args + '; ';
            }
            return output;
        };

        var findCommand = function (command) {
            var query = this.querySearch(command);
            if (query.length > 0 && query.length < 6) {
                for (var item in query) {
                    if (query[item].Name === command) {
                        return query[item];
                    }
                }
            }
            return false;
        };

        var parseCommandLine = function (commandLine) {
            var commands = commandLine.split(';'), cmdArray = [];
            for (var cmd in commands) {
                if (commands[cmd].length > 0) {//TODO: REDO
                    var split = commands[cmd].split(' ');
                    if (split.length === 1 && split[0].length > 0) {//single command
                        var cmdInfo = this.findCommand(((skipfirst === true) ? split[1] : split[0])), args = (typeof cmdInfo === 'undefined') ? '' : (typeof cmdInfo.Value === 'undefined') ? '' : cmdInfo.Value;
                        cmdArray.push({ 'cmd': cmdInfo, 'args': args, 'searchText': split[0] })
                    } else {
                        var skipfirst = (split[0] === ' ' || split[0] === '  ' || split[0] === '') ? true : false;
                        var args = (skipfirst === true) ? commands[cmd].replace(split[0] + split[1], '') : commands[cmd].replace(split[0], '');
                        if (args.charAt(0) === ' ') {
                            args = args.substring(1);
                        }
                        var cmdInfo = this.findCommand(((skipfirst === true) ? split[1] : split[0]));
                        cmdArray.push({ 'cmd': cmdInfo, 'args': args, 'searchText': (skipfirst === true) ? split[1] : split[0] })
                    }
                }

            }
            return cmdArray;
        };

        var create = function (message, commandArray) {
            message.UID = message.label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1)
            $rootScope.model.custom[message.UID] = {
                'UID': message.UID,
                'type': 'custom',
                'disabled': false,
                'cmd': this.renderCommand(commandArray),
                'label': message.label.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
                'text': message.label,
                'italic': message.bold,
                'bold': message.bold,
                'color': message.color,
            };
            $analytics.eventTrack('New Custom Command', {
                category: 'radio_tool',
            });
        };
        return {
            saveEdit: saveChanges,
            newFilter: createFilterFor,
            renderCommand: renderCommand,
            parseCommandLine: parseCommandLine,
            newMessage: create,
            findCommand: findCommand,
            querySearch: querySearch
        };

    }]);
} ());
