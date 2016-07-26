/**
 * @Author: Drop
 * @Creation: 7/25/2016 5:41 PM (The death of Johnathan Kent)
 */
(function () {
    var app = angular.module("csgo-radio");
    var mainController = function ($scope, $rootScope) {
        /** for (var i = 1; i <= 3; ++i) {
            $rootScope.model.standard.push({ cmd: "Item A" + i });
            $rootScope.model.group.push({ cmd: "Item B" + i });
        }*/

        $scope.$watch('model', function (model) {
            console.log(model);
        }, true);

    }
    app.controller("mainController", mainController);
} ());