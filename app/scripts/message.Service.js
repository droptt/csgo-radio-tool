/**
 * @Author: Drop
 * @Creation: 7/25/2016 4:05 PM (Welcome to Jurassic Park)
 */
(function () {

    var messagesService = ['$http', '$rootScope', 'localStorageService', '$filter', function ($http, $rootScope, localStorageService, $filter) {

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

        var customExists = function (custom) {
            for (var message in $rootScope.model.custom) {
                if ($rootScope.model.custom.hasOwnProperty(message)) {
                    console.log($rootScope.model.custom[message]);
                    console.log(custom);
                    if ($rootScope.model.custom[message].cmd === custom.cmd && $rootScope.model.custom[message].text === custom.text)
                        return message;
                }
            }
            return false;
        };

        var importMessages = function (save, imported, shared) { //TODO: Add sanity checks
            $rootScope.model.standard = save.StandardRadio;
            $rootScope.model.group = save.GroupRadio;
            $rootScope.model.report = save.ReportRadio;
            $rootScope.model.Titles = save.Titles;

            if (shared === false) {
                $rootScope.$watch('model', function (model) { //Auto save
                    if (localStorageService.isSupported) {
                        localStorageService.set('saved', { 'StandardRadio': $rootScope.model.standard, 'GroupRadio': $rootScope.model.group, 'ReportRadio': $rootScope.model.report, 'Titles': $rootScope.model.Titles });
                    }
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
                }
            }

            for (var message in save.GroupRadio) {
                if (typeof save.GroupRadio[message] === 'string') {
                    $rootScope.model.messages[save.GroupRadio[message]].disabled = true;
                }
            }

            for (var message in save.ReportRadio) {
                if (typeof save.ReportRadio[message] === 'string') {
                    $rootScope.model.messages[save.ReportRadio[message]].disabled = true;
                }
                else {
                    var check = customExists(save.ReportRadio[message]);
                    if (check !== false) {
                        $rootScope.model.custom[check].disabled = true;
                    }
                }
            }
        }

        return {
            getMessages: getMessages,
            getCustom: getCustom,
            importMessages: importMessages
        };

    }],
        module = angular.module('csgo-radio');
    module.factory('messagesService', messagesService);
} ());
