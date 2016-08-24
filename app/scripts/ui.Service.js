/**
 * @Author: Drop
 * @Creation: 8/15/2016 4:37 PM (The trip to Earth)
 */
(function () {

    angular.module('csgo-radio').factory('uiService', ['$rootScope', '$filter', '$mdDialog', 'messagesService', 'VDFService', '$analytics', 'messageService', function ($rootScope, $filter, $mdDialog, messagesService, VDFService, $analytics, messageService) {

        var InvokeConfirm = function (ev, yes, message, callback) {
            $mdDialog.show($mdDialog.confirm({ skipHide: true })
                .title($filter('translate')('modal.prompt.title'))
                .textContent($filter('translate')('modal.prompt.body') + ' ' + message + '?')
                .targetEvent(ev)
                .ok(yes)
                .cancel($filter('translate')('modal.prompt.no'))).then(callback, function () { });
        };

        var GenericDialogController = ['$scope', '$mdDialog', '$rootScope', function ($scope, $mdDialog, $rootScope) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (awnser) {
                $mdDialog.cancel(awnser);
            }
        }];

        var InvokeDialog = function (ev, options) {
            options.controller = (typeof options.controller === 'undefined') ? GenericDialogController : options.controller;
            options.clickOutsideToClose = (typeof options.clickOutsideToClose === 'undefined') ? false : options.clickOutsideToClose;
            options.skipHide = (typeof options.skipHide === 'undefined') ? false : options.skipHide;
            options.locals = (typeof options.locals === 'undefined') ? {} : options.locals;
            options.callback = (typeof options.callback === 'undefined') ? function () { } : options.callback;
            $mdDialog.show({
                controller: options.controller,
                templateUrl: options.template,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: options.clickOutsideToClose,
                skipHide: options.skipHide,
                locals: options.locals
            }).then(options.callback);
        };

        var confirm = {
            reset: function ($event) {
                InvokeConfirm($event, $filter('translate')('modal.prompt.Reset'), $filter('translate')('modal.prompt.reset'), function () {
                    messagesService.resetMessages();
                    $analytics.eventTrack('Reset Messages', {
                        category: 'radio_tool',
                    });
                });
            },
            default: function ($event) {
                InvokeConfirm($event, $filter('translate')('modal.prompt.yes'), $filter('translate')('modal.prompt.defaults'), function () {
                    messagesService.default();
                    $analytics.eventTrack('Reset to Game defaults', {
                        category: 'radio_tool',
                    });
                });
            },
            deleteCustomCommand: function ($event, message, list, dialog) {
                InvokeConfirm($event, $filter('translate')('modal.prompt.delete'), $filter('translate')('modal.prompt.delcmd') + ' ' + message.text, function () {
                    messageService.deleteMessage(message.UID, list);
                    dialog.cancel();
                });
            },
            deleteImportedCommand: function ($event, list, message, index) {
                InvokeConfirm($event, $filter('translate')('modal.prompt.delete'), $filter('translate')('modal.prompt.delcmd') + ' ' + message.text, function () {
                    $rootScope.model[list].splice(index, 1);
                });
            }
        };

        var dialog = {
            help: function ($event, index) {
                index = (typeof index === 'undefined') ? 0 : index;
                InvokeDialog($event, { template: 'help-dialog.html', skipHide: true, clickOutsideToClose: true, });
                $analytics.eventTrack('Help Dialog', {
                    category: 'radio_tool',
                });
            },
            newMessage: function ($event) {
                InvokeDialog($event, { controller: 'newMessageController', template: 'new-message-dialog.html', locals: { list: undefined, message: undefined, index: undefined } });
            },
            editMessage: function ($event, locals) {
                InvokeDialog($event, { controller: 'newMessageController', template: 'new-message-dialog.html', locals: locals, skipHide: true });
            },
            changelog: function ($event, locals) {
                var onChangelog = function (data) {
                    $rootScope.init.Changelog = true;
                    $rootScope.init.changelog = data;
                    InvokeDialog($event, { template: 'changelog-dialog.html' });
                };
                var onFail = function (reason, type) {
                    //TODO: ERROR HANDLER
                };
                if ($rootScope.init.ChangeLog === true) {
                    InvokeDialog($event, { template: 'changelog-dialog.html' });
                } else {
                    messagesService.getChangelog().then(onChangelog, onFail)
                }
            },
            import: function ($event) {
                InvokeDialog($event, {
                    controller: ['$scope', '$mdDialog', 'messagesService', function ($scope, $mdDialog, messagesService) {
                        $scope.import = { copy: true };

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };

                        $scope.ok = function () {
                            if (Object.keys($scope.importForm.file.$error).length > 0) {
                                $scope.importForm.$submitted = true;
                            } else {
                                if (messagesService.ImportRP($scope.import) !== false) {
                                    $mdDialog.hide();
                                    $analytics.eventTrack('Imported RadioPanel.txt', {
                                        category: 'radio_tool',
                                    });
                                }
                            }
                        };
                    }], template: 'import-dialog.html'
                });
            },
            output: function ($event, output) {
                if (output !== false) {
                    InvokeDialog($event, {
                        template: 'output-dialog.html', locals: { extra: { output: output, helpD: this.help } }, controller: ['$scope', '$mdDialog', 'extra', function ($scope, $mdDialog, extra) {
                            $scope.extra = extra;

                            $scope.hide = function () {
                                $mdDialog.hide();
                            };
                            $scope.cancel = function () {
                                $mdDialog.cancel();
                            };
                        }]
                    });
                    $analytics.eventTrack('Generated RadioPanel.txt', {
                        category: 'radio_tool',
                    });
                } else {
                    $analytics.eventTrack('Tried to Generate empty list', {
                        category: 'radio_tool',
                    });
                }
            }
        };

        return {
            Confirm: confirm,
            Dialog: dialog
        };

    }]);
} ());
