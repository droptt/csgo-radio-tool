/**
 * @Author: Drop
 * @Creation: 7/25/2016 5:41 PM (The death of Johnathan Kent)
 */
(function () {
    var app = angular.module('csgo-radio');
    var mainController = ['$scope', '$rootScope', '$translate', 'localStorageService', 'VDFService', '$filter', 'messagesService', '$mdDialog', function ($scope, $rootScope, $translate, localStorageService, VDFService, $filter, messagesService, $mdDialog) {
        $scope.tooltip = { "edit": $filter("translate")("boxes.tooltip_edit") };
        $scope.generate = function () {
            console.log($rootScope.model);
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
                        if (typeof msg.type === 'message') {
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.cmd] = {};
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.cmd].hotkey = C_I;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.cmd].label = $rootScope.model.messages[msg.cmd].label;
                            buildList['RadioPanel.txt'].Groups[E].Commands[msg.cmd].cmd = $rootScope.model.messages[msg.cmd].cmd;
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

        $scope.showHelp = function (ev, index) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'help-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    selectedI: index
                }
            })
                .then(function (answer) {
                    //TODO: GA tracking
                }, function () {
                });
        };
        $scope.newMessage = function (ev) {
            $mdDialog.show({
                controller: 'newMessageController',
                templateUrl: 'new-message-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    list: undefined,
                    message: undefined,
                    index: undefined
                }
            })
                .then(function () {

                }, function () {

                });
        };
        $scope.editMessage = function (ev, list, item, index) {
            $mdDialog.show({
                controller: 'newMessageController',
                templateUrl: 'new-message-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: {
                    list: list,
                    message: item,
                    index: index
                }
            })
                .then(function () {

                }, function () {

                });
        };
        $scope.importFile = function (ev) {
            $mdDialog.show({
                controller: 'importController',
                templateUrl: 'import-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function () {

                }, function () {

                });
        };
        var Confirm = function (action, extra, ev) {
            switch (action) {
                case 'reset':
                    var message = $filter('translate')('modal.prompt.reset');
                    var yes = $filter('translate')('modal.prompt.Reset');
                    var executeOrder66 = function () {
                        messagesService.resetMessages();
                    };
                    break;

                case 'default':
                    var message = $filter('translate')('modal.prompt.defaults');
                    var yes = $filter('translate')('modal.prompt.yes');
                    var executeOrder66 = function () {
                        messagesService.default();
                    };
                    break;

                case 'customReset': //change this to delteCustomCommand
                    var message = $filter('translate')('modal.prompt.creset');
                    var yes = $filter('translate')('modal.prompt.yes');
                    var executeOrder66 = function () {
                        messagesService.resetMessages();
                    };
                    break;

                case 'deleteImportedCommand':
                    var message = $filter('translate')('modal.prompt.delcmd') + $rootScope.model[extra.list][extra.index].text;
                    var yes = $filter('translate')('modal.prompt.delete');
                    var executeOrder66 = function () {
                        $rootScope.model[extra.list].splice(extra.index, 1)
                    };
                    break;
            }
            var confirm = $mdDialog.confirm()
                .title($filter('translate')('modal.prompt.title'))
                .textContent($filter('translate')('modal.prompt.body') + " " + message + '? This action cannot be undone (in the near-future it will).')
                .targetEvent(ev)
                .ok(yes)
                .cancel($filter('translate')('modal.prompt.no'));
            $mdDialog.show(confirm).then(function () {
                executeOrder66();
            }, function () {
            });
        };
        $scope.resetMessages = function ($event) {
            Confirm('reset', null, $event);
        };
        $scope.defaults = function ($event) {
            Confirm('default', null, $event);
        };
    }];
    app.controller('mainController', mainController);
    function DialogController($scope, $mdDialog, selectedI) {
        $scope.selectedI = selectedI;
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }
} ());