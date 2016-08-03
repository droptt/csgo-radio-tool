/**
 * @Author: Drop
 * @Creation: 8/3/2016 3:30 PM ()
 */
(function () {
    var app = angular.module('csgo-radio');

    var promptController = ['$scope', '$rootScope', '$uibModalInstance', 'action', 'extra', '$filter', 'messagesService', function ($scope, $rootScope, $uibModalInstance, action, extra, $filter, messagesService) {

        $scope.prompt = {};

        switch (action) {
            case "reset":
                $scope.message = $filter('translate')('modal.prompt.reset');
                $scope.yes = $filter('translate')('modal.prompt.Reset');
                var executeOrder66 = function () {
                    messagesService.resetMessages();
                };
                break;

            case "default":
                $scope.message = $filter('translate')('modal.prompt.defaults');
                $scope.yes = $filter('translate')('modal.prompt.yes');
                var executeOrder66 = function () {
                    messagesService.default();
                };
                break;

            case "customReset": //change this to delteCustomCommand
                $scope.message = $filter('translate')('modal.prompt.creset');
                $scope.yes = $filter('translate')('modal.prompt.yes');
                var executeOrder66 = function () {
                    messagesService.resetMessages();
                };
                break;

            case "deleteImportedCommand":
                $scope.message = $filter('translate')('modal.prompt.delcmd') + $rootScope.model[extra.list][extra.index].text;
                $scope.yes = $filter('translate')('modal.prompt.delete');
                var executeOrder66 = function() {
                    $rootScope.model[extra.list].splice(extra.index, 1)
                };
                break;
        }

        $scope.cancel = function () {
            $scope.edit = false;
            $uibModalInstance.close('cancel');
        };

        $scope.yes = function () {
            executeOrder66();
            $uibModalInstance.close('ok');
        };
    }];

    app.controller('promptController', promptController);
} ());
