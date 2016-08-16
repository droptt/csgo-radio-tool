/**
 * @Author: Drop
 * @Creation: 7/25/2016 5:41 PM (The death of Johnathan Kent)
 */
(function () {
    var app = angular.module('csgo-radio');
    var mainController = ['$scope', '$rootScope', 'messagesService', 'uiService', function ($scope, $rootScope, messagesService, uiService) {
        $scope.generate = function (ev) {
           uiService.Dialog.output(ev, messagesService.GenerateRP(ev));
        };

        $scope.openChangelog = function(ev) {
            uiService.Dialog.changelog(ev);
        }

        $scope.showHelp = function (ev, index) {
            uiService.Dialog.help(ev, index);
        };
        $scope.newMessage = function (ev) {
            uiService.Dialog.newMessage(ev);
        };

        $scope.editMessage = function (ev, list, item, index) {
            uiService.Dialog.editMessage(ev, { list: list, message: item, index: index });
        };

        $scope.importFile = function (ev) {
            uiService.Dialog.import(ev);
        };

        $scope.moved = function (list, index) {
            $rootScope.model[list].splice(index, 1);
        };

        $scope.resetMessages = function ($event) {
            uiService.Confirm.reset($event);
        };

        $scope.defaults = function ($event) {
            uiService.Confirm.default($event);
        };
    }];
    app.controller('mainController', mainController);
} ());