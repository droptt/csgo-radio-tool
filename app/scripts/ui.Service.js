/**
 * @Author: Drop
 * @Creation: 8/15/2016 4:37 PM (The trip to Earth)
 */
(function () {

    angular.module('csgo-radio').factory('uiService', ['$rootScope', '$filter', '$mdDialog', 'messagesService', 'VDFService', function ($rootScope, $filter, $mdDialog, messagesService, VDFService) {

        var InvokeConfirm = function (ev, yes, message, callback) {
            $mdDialog.show($mdDialog.confirm()
                .title($filter('translate')('modal.prompt.title'))
                .textContent($filter('translate')('modal.prompt.body') + ' ' + message + '? This action cannot be undone (in the near-future it will).')
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
                });
            },
            default: function ($event) {
                InvokeConfirm($event, $filter('translate')('modal.prompt.defaults'), $filter('translate')('modal.prompt.yes'), function () {
                    messagesService.default();
                });
            },
            deleteCustomCommand: function ($event, UID) {
                InvokeConfirm($event, $filter('translate')('modal.prompt.Reset'), $filter('translate')('modal.prompt.yes'), function () {
                    messagesService.deleteMessage();
                });
            },
            deleteImportedCommand: function ($event, list, message, index) {
                InvokeConfirm($event, $filter('translate')('modal.prompt.delcmd'), $filter('translate')('modal.prompt.delete') + " " + message.text, function () {
                    $rootScope.model[list].splice(index, 1);
                });
            }
        };

        var dialog = {
            help: function ($event, index) {
                index = (typeof index === 'undefined') ? 0 : index;
                InvokeDialog($event, { template: 'help-dialog.html', skipHide: true, clickOutsideToClose: true, });
            },
            newMessage: function ($event) {
                InvokeDialog($event, { controller: 'newMessageController', template: 'new-message-dialog.html', locals: { list: undefined, message: undefined, index: undefined } });
            },
            editMessage: function ($event, locals) {
                InvokeDialog($event, { controller: 'newMessageController', template: 'new-message-dialog.html', locals: locals });
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
                            if (messagesService.ImportRP($scope.import) !== false) {
                                $mdDialog.hide();
                            } else {
                                $scope.import.error = true;
                            }
                        };
                    }], template: 'import-dialog.html'
                });
            },
            output: function ($event, output) {
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
            }
        };

        return {
            Confirm: confirm,
            Dialog: dialog
        };

    }]);
} ());
