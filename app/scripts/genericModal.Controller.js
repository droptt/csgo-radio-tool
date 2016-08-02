/**
 * @Author: Drop
 * @Creation: 7/29/2016 2:20 PM (Desert Chase)
 */
(function () {
    var app = angular.module('csgo-radio');

    var genericModalController = function ($scope, $uibModalInstance, extra) {
        $scope.extra = extra;

        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };
    };

    app.controller('genericModalController', genericModalController);
} ());
