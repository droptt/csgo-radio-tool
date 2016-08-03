/**
 * @Author: Drop
 * @Creation: 8/2/2016 3:06 PM (The Big Rescue)
 */
(function () {
    var app = angular.module('csgo-radio');

    var newMessageModalController = ['$scope', '$rootScope', '$uibModalInstance', function ($scope, $rootScope, $uibModalInstance) {

        $scope.newMsg = {};

        var create = function (message) {
            message.UID = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
            message.type = 'custom';
            message.disabled = false;
            message.label = message.text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            $rootScope.model.custom[message.UID] = message;
        };

        $scope.cancel = function () {
            $scope.edit = false;
            $uibModalInstance.close('cancel');
        };

        $scope.save = function () {
            create($scope.newMsg);
            $uibModalInstance.close('ok');
        };
    }];

    app.controller('newMessageModalController', newMessageModalController);
} ());
