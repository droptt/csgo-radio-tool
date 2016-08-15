/**
 * @Author: Drop
 * @Creation: 7/25/2016 4:05 PM (Welcome to Jurassic Park)
 */
(function () {

    angular.module('csgo-radio').factory('messagesService', ['$http', '$rootScope', 'localStorageService', '$filter', '$location', function ($http, $rootScope, localStorageService, $filter, $location) {

        var getMessages = function () {
            return $http.get('radio.json')
                .then(function (response) {
                    return response.data;
                });
        };
        var getCustom = function () {
            return $http.get('custom.json')
                .then(function (response) {
                    return response.data;
                });
        };
        var getCommand = function () {
            return $http.get('command.json')
                .then(function (response) {
                    return response.data;
                });
        };

        var convertList = function (list) {
            var filteredList = [];
            for (var message in list) {
                if (list[message].type === "message") {
                    filteredList.push(list[message].cmd);
                } else {
                    filteredList.push(list[message]);
                    delete filteredList[message].type;
                    delete filteredList[message].disabled;
                    delete filteredList[message].UID;
                    delete filteredList[message].$$hashKey;
                }
            }
            return filteredList;
        };

        var filterCustomList = function (list) {
            var filteredList = {};
            for (var message in list) {
                filteredList[message] = list[message];
                delete filteredList[message].type;
                delete filteredList[message].disabled;
                delete filteredList[message].UID;
            }
            return filteredList;
        };

        var save = function () {
            console.log("Saving")
            var save = {
                'StandardRadio': convertList($rootScope.model.standard), 'GroupRadio': convertList($rootScope.model.group), 'ReportRadio': convertList($rootScope.model.report), 'Titles': [
                    ($rootScope.model.Titles[0] === $filter('translate')('boxes.title_0')) ? null : $rootScope.model.Titles[0],
                    ($rootScope.model.Titles[1] === $filter('translate')('boxes.title_1')) ? null : $rootScope.model.Titles[1],
                    ($rootScope.model.Titles[2] === $filter('translate')('boxes.title_2')) ? null : $rootScope.model.Titles[2],
                ]
            };
            if (localStorageService.isSupported) {
                localStorageService.set('saved', save);
            }
            saveHash(save);
        };

        var htmlTags = function (msg, imported) { //actually, imported should be false
            var label = msg.text || msg.label;
            msg.italic = (this.strContains(label, '<i>') === true) ? true : false;
            msg.bold = (this.strContains(label, '<b>') === true) ? true : false;
            if (this.strContains(label, '<font') === true) {
                var RG = label.match(/color='(.*?)'/);
                msg.color = RG[1];
                if (imported === true) {
                    label = label.replace('<font ' + RG[0] + '>', '').replace('</font>', '');
                } else {
                    label = label.replace('<font ' + RG[0] + '>', '').replace('</font>', '');
                }
            }
            if (imported === true) {
                msg.text = label.replace('<i>', '').replace('</i>', '').replace('<b>', '').replace('</b>', '');
            } else {
                msg.label = label.replace('<i>', '').replace('</i>', '').replace('<b>', '').replace('</b>', '');
            }
            return msg;
        }

        var customExists = function (custom) {
            for (var message in $rootScope.model.custom) {
                if ($rootScope.model.custom.hasOwnProperty(message)) {
                    if ($rootScope.model.custom[message].cmd === custom.cmd && $rootScope.model.custom[message].text === custom.text) {
                        return message;
                    }
                }
            }
            return false;
        };

        var resetMessages = function () {
            $rootScope.model.standard = [];
            $rootScope.model.group = [];
            $rootScope.model.report = [];
            $rootScope.model.Titles = [$filter('translate')('boxes.title_0'), $filter('translate')('boxes.title_1'), $filter('translate')('boxes.title_2')];

            for (var message in $rootScope.model.messages) {
                $rootScope.model.messages[message].disabled = false;
            }
            for (var custom in $rootScope.model.custom) {
                $rootScope.model.custom[custom].disabled = false;
            }
        };

        var customSave = function () { //Auto save custom
            if (localStorageService.isSupported) {
                localStorageService.set('custom', filterCustomList($rootScope.model.custom));
            }
        };

        var importCustom = function (custom) {
            $rootScope.model.custom = custom;
            $rootScope.$watch('model.custom', customSave, true);
        };

        var SaveMessages = save;

        var importMessages = function (save, imported, shared, copy) { //TODO: Add sanity checks
            resetMessages();
            $rootScope.model.standard = save.StandardRadio;
            $rootScope.model.group = save.GroupRadio;
            $rootScope.model.report = save.ReportRadio;
            $rootScope.model.Titles = save.Titles;

            for (var i = 0; i <= 2; ++i) {
                if ($rootScope.model.Titles[i] === null) {
                    $rootScope.model.Titles[i] = $filter('translate')('boxes.title_' + i);
                }
            }
            var groups = ['StandardRadio', 'GroupRadio', 'ReportRadio'];

            for (var group in groups) {
                var group = groups[group];
                for (var message in save[group]) {
                    if (typeof save[group][message] === 'string') {
                        $rootScope.model.messages[save[group][message]].disabled = true;
                        save[group][message] = { 'type': 'message', 'cmd': save[group][message] };
                    }
                    else {
                        var check = customExists(save[group][message]);
                        console.log(check);
                        if (typeof check === 'string') {
                            $rootScope.model.custom[check].disabled = true;
                            save[group][message].type = 'custom';
                            save[group][message].UID = $rootScope.model.custom[check].UID;
                            continue;
                        } else {
                            if (copy === true) {
                                save[group][message].UID = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
                                save[group][message].type = 'custom';
                                save[group][message].disabled = false;
                                save[group][message].label = save[group][message].text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
                                $rootScope.model.custom[save[group][message].UID] = save[group][message];
                            }
                            if (imported === true || shared === true) {
                                save[group][message].type = 'imported';
                                save[group][message].disabled = false;
                                save[group][message].label = save[group][message].text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
                            }
                        }
                    }
                }
            }
            if (shared === false && imported === false && $rootScope.model.watch !== true) {
                $rootScope.$watch('model', SaveMessages, true);
                $rootScope.model.watch = true;
            }
        }

        var defaults = function () {
            importMessages(JSON.parse('{"StandardRadio":["go","fallback","sticktog","holdpos","followme"],"GroupRadio":["roger","negative","cheer","compliment","thanks"],"ReportRadio":["enemyspot","needbackup","takepoint","sectorclear","inposition"],"Titles":[null,null,null]}'), false, false, false)
        };

        var saveHash = function (save) {
            if (typeof save === 'undefined') {
                var save = {
                    'StandardRadio': convertList($rootScope.model.standard), 'GroupRadio': convertList($rootScope.model.group), 'ReportRadio': convertList($rootScope.model.report), 'Titles': [
                        ($rootScope.model.Titles[0] === $filter('translate')('boxes.title_0')) ? null : $rootScope.model.Titles[0],
                        ($rootScope.model.Titles[1] === $filter('translate')('boxes.title_1')) ? null : $rootScope.model.Titles[1],
                        ($rootScope.model.Titles[2] === $filter('translate')('boxes.title_2')) ? null : $rootScope.model.Titles[2],
                    ]
                };
            }
            $location.hash(JSON.stringify(save));
        }

        return {
            getMessages: getMessages,
            getCustom: getCustom,
            save: save,
            importMessages: importMessages,
            resetMessages: resetMessages,
            importCustom: importCustom,
            checkHtmlTags: htmlTags,
            default: defaults,
            saveHash: saveHash,
            getCommand: getCommand,
            customSave: customSave
        };

    }]);
} ());
