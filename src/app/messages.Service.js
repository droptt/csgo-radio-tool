/**
 * @Author: Drop
 * @Creation: 7/25/2016 4:05 PM (Welcome to Jurassic Park)
 */
(function () {

    angular.module('csgo-radio').factory('messagesService', ['$http', '$rootScope', 'localStorageService', '$filter', '$location', 'VDFService', '$mdToast', function ($http, $rootScope, localStorageService, $filter, $location, VDFService, $mdToast) {

        var getMessages = function () {
            return $http.get('data/radio.json')
                .then(function (response) {
                    return response.data;
                });
        };
        var getChangelog = function () {
            return $http.get('data/changelog.json')
                .then(function (response) {
                    return response.data;
                });
        };
        var getCustom = function () {
            return $http.get('data/custom.json')
                .then(function (response) {
                    return response.data;
                });
        };
        var getCommand = function () {
            return $http.get('data/command.json')
                .then(function (response) {
                    return response.data;
                });
        };

        var generateRP = function ($event) {
            if ($rootScope.model.standard.length > 0 || $rootScope.model.group.length > 0 || $rootScope.model.report.length > 0) {
                var buildList = angular.copy($rootScope.settings.radioMenu);
                buildList['RadioPanel.txt'].Groups.standard.title = ($rootScope.model.Titles[0] === $filter('translate')('boxes.title_0')) ? '#SFUI_CommandRadio' : $rootScope.model.Titles[0];
                buildList['RadioPanel.txt'].Groups.group.title = ($rootScope.model.Titles[1] === $filter('translate')('boxes.title_1')) ? '#SFUI_StandardRadio' : $rootScope.model.Titles[1];
                buildList['RadioPanel.txt'].Groups.report.title = ($rootScope.model.Titles[2] === $filter('translate')('boxes.title_2')) ? '#SFUI_ReportRadio' : $rootScope.model.Titles[2];
                for (var C_box in $rootScope.settings.boxes) {
                    var C_I = 1,
                        E = $rootScope.settings.boxes[C_box].replace('Radio', '').toLowerCase();
                    for (var C_msg in $rootScope.model[E]) {
                        var msg = $rootScope.model[E][C_msg];
                        if (msg.type === 'message') {
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.cmd] = {};
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.cmd].hotkey = C_I;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.cmd].label = $rootScope.model.messages[msg.cmd].label;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.cmd].cmd = $rootScope.model.messages[msg.cmd].cmd;
                        } else {
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.UID] = {};
                            if (msg.italic === true && msg.bold === false) {
                                var label = '<i>' + msg.label + '</i>';
                            } else if (msg.italic === false && msg.bold === true) {
                                var label = '<b>' + msg.label + '</b>';
                            } else if (msg.italic === true && msg.bold === true) {
                                var label = '<i><b>' + msg.label + '</b></i>';
                            } else {
                                var label = msg.label;
                            }
                            if (msg.color !== false && msg.color !== '#000000' && typeof msg.color !== 'undefined') {
                                label = '<font color=' + msg.color + '>' + label + '</font>';
                            }
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.UID].hotkey = C_I;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.UID].label = label;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.UID].cmd = msg.cmd;
                        }
                        C_I++;
                    }
                }
                return VDFService.stringify(buildList, true);
            }
            return false;
        };

        var convertList = function (list) {
            var filteredList = [];
            for (var message in list) {
                if (list[message].type === 'message') {
                    filteredList.push(list[message].cmd);
                } else {
                    filteredList.push({
                        'label': list[message].label,
                        'text': list[message].text,
                        'cmd': list[message].cmd,
                        'italic': (typeof list[message].italic !== 'undefined') ? list[message].italic : false,
                        'bold': (typeof list[message].bold !== 'undefined') ? list[message].bold : false,
                        'color': (typeof list[message].color !== 'undefined') ? list[message].color : false,
                    });
                }
            }
            return filteredList;
        };

        var save = function () {
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
        
        var saveAs = function(name){
            if (localStorageService.isSupported) {
                var save = {
                    'StandardRadio': convertList($rootScope.model.standard), 'GroupRadio': convertList($rootScope.model.group), 'ReportRadio': convertList($rootScope.model.report), 'Titles': [
                        ($rootScope.model.Titles[0] === $filter('translate')('boxes.title_0')) ? null : $rootScope.model.Titles[0],
                        ($rootScope.model.Titles[1] === $filter('translate')('boxes.title_1')) ? null : $rootScope.model.Titles[1],
                        ($rootScope.model.Titles[2] === $filter('translate')('boxes.title_2')) ? null : $rootScope.model.Titles[2],
                    ]
                };
                if (localStorageService.get("multi_save") == true) {
                    $rootScope.saves[name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1)] = {"name": name, "created":Date.now(), "save":save, "modified":Date.now()};
                    localStorageService.set("saves",$rootScope.saves);
                } else {
                    localStorageService.set("multi_save", true);
                    var saves = {};
                    saves[name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1)] = {"name": name, "created":Date.now(), "save":save, "modified":Date.now()};
                    localStorageService.set("saves", saves);
                }
            }
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
            $rootScope.model.standard.length = 0;
            $rootScope.model.group.length = 0;
            $rootScope.model.report.length = 0;
            $rootScope.model.Titles = [$filter('translate')('boxes.title_0'), $filter('translate')('boxes.title_1'), $filter('translate')('boxes.title_2')];

            for (var message in $rootScope.model.messages) {
                $rootScope.model.messages[message].disabled = false;
            }
            for (var custom in $rootScope.model.custom) {
                $rootScope.model.custom[custom].disabled = false;
            }
        };

        var customFilter = function (list) {
            var filteredList = {};
            for (var message in list) {
                filteredList[message] = {
                    'UID': list[message].UID,
                    'label': list[message].label,
                    'text': list[message].text,
                    'cmd': list[message].cmd,
                    'italic': (typeof list[message].italic !== 'undefined') ? list[message].italic : false,
                    'bold': (typeof list[message].bold !== 'undefined') ? list[message].bold : false,
                    'color': (typeof list[message].color !== 'undefined') ? list[message].color : false,
                    'type': list[message].type
                };
            }
            return filteredList;
        };

        var customSave = function () { //Auto save custom
            if (localStorageService.isSupported) {
                localStorageService.set('custom', customFilter($rootScope.model.custom));
            }
        };

        var importCustom = function (custom) {
            $rootScope.model.custom = custom;
            $rootScope.$watch('model.custom', customSave, true);
        };

        var importOldCustom = function (custom) {
            var newList = {};
            for (var message in custom) {
                var UID = custom[message].label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
                newList[UID] = {
                    'UID': UID,
                    'text': custom[message].label,
                    'label': custom[message].label.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
                    'cmd': custom[message].cmd,
                    'italic': (typeof custom[message].italic !== 'undefined') ? custom[message].italic : false,
                    'bold': (typeof custom[message].bold !== 'undefined') ? custom[message].bold : false,
                    'color': (typeof custom[message].color !== 'undefined') ? custom[message].color : false,
                    'type': 'custom'
                };
            }
            this.importCustom(newList);
        };

        var SaveMessages = save;

        var ImportRP = function (model) {
            var parse = VDFService.parse(model.file);
            if (typeof parse['RadioPanel.txt'] !== 'undefined' && parse !== false) {
                var obj = {};
                for (var group in parse['RadioPanel.txt'].Groups) {
                    if (group === 'group' || group === 'report' || group === 'standard') {
                        obj[group] = [];
                        for (var msg in parse['RadioPanel.txt'].Groups[group].Commands) {
                            var cMsg = parse['RadioPanel.txt'].Groups[group].Commands[msg];
                            if ($rootScope.model.messages.hasOwnProperty(cMsg.cmd) === true) {
                                obj[group].push(cMsg.cmd);
                            } else {
                                obj[group].push(this.checkHtmlTags(cMsg));
                            }
                        }
                    }
                }
                obj['titles'] = Array((parse['RadioPanel.txt'].Groups.standard.title === '#SFUI_CommandRadio') ? null : parse['RadioPanel.txt'].Groups.standard.title,
                    (parse['RadioPanel.txt'].Groups.group.title === '#SFUI_StandardRadio') ? null : parse['RadioPanel.txt'].Groups.group.title,
                    (parse['RadioPanel.txt'].Groups.report.title === '#SFUI_ReportRadio') ? null : parse['RadioPanel.txt'].Groups.report.title);
                this.importMessages({ 'StandardRadio': obj.standard, 'GroupRadio': obj.group, 'ReportRadio': obj.report, 'Titles': obj.titles }, true, false, model.copy);
            } else {
                return false;
            }
        };

        var importMessages = function (save, imported, shared, copy) {
            if (typeof save.StandardRadio !== 'undefined' && typeof save.GroupRadio !== 'undefined' && typeof save.ReportRadio !== 'undefined' && typeof save.Titles !== 'undefined') {
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
                            if (typeof save[group][message].text === 'undefined') { //We have a 1.x commandlist here
                                save[group][message].text = save[group][message].label;
                            }
                            var check = customExists(save[group][message]);
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
            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('This is not RadioPanel.txt')
                        .position('top right')
                        .hideDelay(5000)
                );
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
            getChangelog: getChangelog,
            save: save,
            importMessages: importMessages,
            resetMessages: resetMessages,
            importCustom: importCustom,
            checkHtmlTags: htmlTags,
            default: defaults,
            saveHash: saveHash,
            getCommand: getCommand,
            customSave: customSave,
            ImportRP: ImportRP,
            GenerateRP: generateRP,
            importOldCustom: importOldCustom,
            saveAs: saveAs
        };

    }]);
} ());
