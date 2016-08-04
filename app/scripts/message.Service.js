/**
 * @Author: Drop
 * @Creation: 7/25/2016 4:05 PM (Welcome to Jurassic Park)
 */
(function () {

    var messagesService = ['$http', '$rootScope', 'localStorageService', '$filter', '$location', function ($http, $rootScope, localStorageService, $filter, $location) {

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

        var htmlTags = function (msg, imported) { //actually, imported should be false
            var label = msg.text || msg.label;
            msg.italic = (this.strContains(label, "<i>") === true) ? true : false;
            msg.bold = (this.strContains(label, "<b>") === true) ? true : false;
            if (this.strContains(label, "<font") === true) {
                var RG = label.match(/color='(.*?)'/);
                msg.color = RG[1];
                if (imported === true) {
                    label = label.replace("<font " + RG[0] + ">", "").replace("</font>", "");
                } else {
                    label = label.replace("<font " + RG[0] + ">", "").replace("</font>", "");
                }
            }
            if (imported === true) {
                msg.text = label.replace("<i>", "").replace("</i>", "").replace("<b>", "").replace("</b>", "");
            } else {
                msg.label = label.replace("<i>", "").replace("</i>", "").replace("<b>", "").replace("</b>", "");
            }
            return msg;
        }

        var customExists = function (custom) {
            for (var message in $rootScope.model.custom) {
                if ($rootScope.model.custom.hasOwnProperty(message)) {
                    if ($rootScope.model.custom[message].cmd === custom.cmd && $rootScope.model.custom[message].text === custom.text)
                        return message;
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

        var importCustom = function (custom) {
            $rootScope.model.custom = custom;
            $rootScope.$watch('model.custom', function () { //Auto save custom
                if (localStorageService.isSupported) {
                    localStorageService.set('custom', $rootScope.model.custom);
                }
            }, true);
        };

        var importMessages = function (save, imported, shared, copy) { //TODO: Add sanity checks
            console.log("MessageService ImportMessages: Save: " + JSON.stringify(save) + " Imported: " + imported + " Shared: " + shared);
            resetMessages();
            $rootScope.model.standard = save.StandardRadio;
            $rootScope.model.group = save.GroupRadio;
            $rootScope.model.report = save.ReportRadio;
            $rootScope.model.Titles = save.Titles;

            if (shared === false && imported === false) {
                $rootScope.$watch('model', function (model) { //Auto save
                    var save = {
                        'StandardRadio': $rootScope.model.standard, 'GroupRadio': $rootScope.model.group, 'ReportRadio': $rootScope.model.report, 'Titles': [
                            ($rootScope.model.Titles[0] === $filter('translate')('boxes.title_0')) ? null : $rootScope.model.Titles[0],
                            ($rootScope.model.Titles[1] === $filter('translate')('boxes.title_1')) ? null : $rootScope.model.Titles[1],
                            ($rootScope.model.Titles[2] === $filter('translate')('boxes.title_2')) ? null : $rootScope.model.Titles[2],
                        ]
                    };
                    if (localStorageService.isSupported) {
                        localStorageService.set('saved', save);
                    }
                    $location.hash(JSON.stringify(save));
                }, true);
            }

            for (var i = 0; i <= 2; ++i) {
                if ($rootScope.model.Titles[i] === null) {
                    $rootScope.model.Titles[i] = $filter('translate')('boxes.title_' + i);
                }
            }

            for (var message in save.StandardRadio) { //TODO: Redo this
                if (typeof save.StandardRadio[message] === 'string') {
                    $rootScope.model.messages[save.StandardRadio[message]].disabled = true;
                }
                else {
                    var check = customExists(message);
                    if (check !== false) {
                        $rootScope.model.custom[check].disabled = true;
                    }
                    if (copy === true) {
                        message.UID = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
                        message.type = 'custom';
                        message.disabled = false;
                        message.label = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
                        $rootScope.model.custom[message.UID] = message;
                    } else if (imported === true || shared === true) {
                        console.log(message);
                        message.type = 'imported';
                        message.disabled = false;
                        message.label = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
                    }
                }
            }

            for (var message in save.GroupRadio) {
                if (typeof save.GroupRadio[message] === 'string') {
                    $rootScope.model.messages[save.GroupRadio[message]].disabled = true;
                }
                else {
                    var check = customExists(message);
                    if (check !== false) {
                        $rootScope.model.custom[check].disabled = true;
                    }
                    if (copy === true) {
                        message.UID = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
                        message.type = 'custom';
                        message.disabled = false;
                        message.label = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
                        $rootScope.model.custom[message.UID] = message;
                    }
                }
            }

            for (var message in save.ReportRadio) {
                if (typeof save.ReportRadio[message] === 'string') {
                    $rootScope.model.messages[save.ReportRadio[message]].disabled = true;
                }
                else {
                    var check = customExists(message);
                    if (check !== false) {
                        $rootScope.model.custom[check].disabled = true;
                    }
                    if (copy === true) {
                        message.UID = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
                        message.type = 'custom';
                        message.disabled = false;
                        message.label = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
                        $rootScope.model.custom[message.UID] = message;
                    }
                }
            }
            console.log($rootScope.model);
        }

        var defaults = function () {
            importMessages(JSON.parse('{"StandardRadio":["go","fallback","sticktog","holdpos","followme"],"GroupRadio":["roger","negative","cheer","compliment","thanks"],"ReportRadio":["enemyspot","needbackup","takepoint","sectorclear","inposition"],"Titles":[null,null,null]}'), false, false, false)
        };

        return {
            getMessages: getMessages,
            getCustom: getCustom,
            importMessages: importMessages,
            resetMessages: resetMessages,
            importCustom: importCustom,
            checkHtmlTags: htmlTags,
            default: defaults
        };

    }],
        module = angular.module('csgo-radio');
    module.factory('messagesService', messagesService);
} ());
