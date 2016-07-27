/**
 * @Author: Drop
 * @Creation: 7/25/2016 5:41 PM (The death of Johnathan Kent)
 */
(function () {
    var app = angular.module('csgo-radio');
    var mainController = function ($scope, $rootScope, $translate, $uibModal, localStorageService, VDFService) {
        /** for (var i = 1; i <= 3; ++i) {
            $rootScope.model.standard.push({ cmd: "Item A" + i });
            $rootScope.model.group.push({ cmd: "Item B" + i });
        }*/

        //if(typeof $rootScope.model.Titles[0] === null) { //TODO: redo this
        $rootScope.model.Titles[0] = 'Standard';
        $scope.standardTitle = $rootScope.model.Titles[0];
        //}

        $scope.resetMessages = function () { //TODO: Redo this
            $rootScope.model.standard = [];
            $rootScope.model.group = [];
            $rootScope.model.report = [];
            $rootScope.model.Titles = [null, null, null];

            for (var message in $rootScope.model.messages) {
                $rootScope.model.messages[message].disabled = false;
            }
        };

        $scope.generate = function () {
            console.log(VDFService.stringify($rootScope.model, true));
        };

        $scope.openModal = function (modal) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: modal + '.html',
                controller: 'messageController',
            });
        };
    }
    app.controller('mainController', mainController);
} ());