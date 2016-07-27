/**
 * @Author: Drop
 * @Creation: 7/25/2016 4:05 PM (Welcome to Jurassic Park)
 */
(function () {

    var messagesService = function ($http, $rootScope, localStorageService) {

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

        var importMessages = function (save, imported, shared) {
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

            for (var message in save.StandardRadio) { //TODO: Redo this
                if (typeof save.StandardRadio[message] === 'string') {
                    $rootScope.model.messages[save.StandardRadio[message]].disabled = true;
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
            }
        }

        return {
            getMessages: getMessages,
            getCustom: getCustom,
            importMessages: importMessages
        };

    },
        module = angular.module('csgo-radio');
    module.factory('messagesService', messagesService);
} ());
