/**
 * @Author: Drop
 * @Creation: 7/25/2016 5:41 PM (The death of Johnathan Kent)
 */
(function () {
    var app = angular.module('csgo-radio');
    var mainController = ['$scope', '$rootScope', '$translate', '$uibModal', 'localStorageService', 'VDFService', '$filter', 'messagesService', function ($scope, $rootScope, $translate, $uibModal, localStorageService, VDFService, $filter, messagesService) {
        /** for (var i = 1; i <= 3; ++i) {
            $rootScope.model.standard.push({ cmd: "Item A" + i });
            $rootScope.model.group.push({ cmd: "Item B" + i });
        }*/

        $scope.resetMessages = function () {
            messagesService.resetMessages();
        };

        $scope.generate = function () {
            if ($rootScope.model.standard.length > 0 || $rootScope.model.group.length > 0 || $rootScope.model.report.length > 0) {
                var buildList = angular.extend({}, $rootScope.settings.radioMenu);
                buildList['RadioPanel.txt'].Groups.standard.title = ($rootScope.model.Titles[0] === $filter('translate')('boxes.title_0')) ? '#SFUI_CommandRadio' : $rootScope.model.Titles[0];
                buildList['RadioPanel.txt'].Groups.group.title = ($rootScope.model.Titles[1] === $filter('translate')('boxes.title_1')) ? '#SFUI_StandardRadio' : $rootScope.model.Titles[1];
                buildList['RadioPanel.txt'].Groups.report.title = ($rootScope.model.Titles[2] === $filter('translate')('boxes.title_2')) ? '#SFUI_ReportRadio' : $rootScope.model.Titles[2];
                for (var C_box in $rootScope.settings.boxes) {
                    var C_I = 1,
                        E = $rootScope.settings.boxes[C_box].replace('Radio', '').toLowerCase();
                    for (var C_msg in $rootScope.model[E]) {
                        var msg = $rootScope.model[E][C_msg];
                        if (typeof msg === 'string') {
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg] = {};
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg].hotkey = C_I;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg].label = $rootScope.model.messages[msg].label;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg].cmd = $rootScope.model.messages[msg].cmd;
                        } else if (typeof msg === 'object') {
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.name] = {};
                            if (msg.italic === true && msg.bold === false) {
                                var label = '<i>' + msg.label + '</i>';
                            } else if (msg.italic === false && msg.bold === true) {
                                var label = '<b>' + msg.label + '</b>';
                            } else if (msg.italic === true && msg.bold === true) {
                                var label = '<i><b>' + msg.label + '</b></i>';
                            } else {
                                var label = msg.label;
                            }
                            //if (msg.color !== false && msg.color !== "#000000") {
                            //label = "<font color='+msg.color+'>'" + label + "'</font>";
                            //}
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.name].hotkey = C_I;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.name].label = label;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.name].cmd = msg.cmd;
                        }
                        C_I++;
                    }
                }
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'success-modal.html',
                    controller: 'genericModalController',
                    resolve: {
                        extra: function (VDFService) {
                            return VDFService.stringify(buildList, true);
                        }
                    }
                });
            }
        };

        $scope.openModal = function (modal) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: modal + '.html',
                controller: 'genericModalController',
                resolve: {
                    extra: function () {
                        return null;
                    }
                }
            });
        };
        $scope.newMessage = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'new-message-modal.html',
                controller: 'newMessageModalController',
            });
        };
        $scope.importFile = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'import-modal.html',
                controller: 'importController',
            });
        };
        $scope.confirm = function (action, extra) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'prompt-modal.html',
                controller: 'promptController',
                resolve: {
                    action: function (action) {
                        return action;
                    },
                    extra: function (extra) {
                        return extra;
                    }
                }
            });
        };
    }];
    app.controller('mainController', mainController);
} ());