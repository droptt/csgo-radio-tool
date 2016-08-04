/**
 * @Author: Drop
 * @Creation: 8/3/2016 9:34 PM (Radagast the brown)
 */
(function () {
    var app = angular.module('csgo-radio');

    var sharedController = ['$scope', '$rootScope', function ($scope, $rootScope) {

        $scope.save = function () {
            $rootScope.$watch('model', function (model) { //Auto save
                var save = {
                    'StandardRadio': $rootScope.model.standard, 'GroupRadio': $rootScope.model.group, 'ReportRadio': $rootScope.model.report, 'Titles': [
                        ($rootScope.model.Titles[0] === $filter('translate')('boxes.title_0')) ? null : $rootScope.model.Titles[0],
                        ($rootScope.model.Titles[1] === $filter('translate')('boxes.title_1')) ? null : $rootScope.model.Titles[1],
                        ($rootScope.model.Titles[2] === $filter('translate')('boxes.title_2')) ? null : $rootScope.model.Titles[2],
                    ]
                };
                if (localStorageService.isSupported) {
                    localStorageService.set('saved', save);
                }
                $location.hash(JSON.stringify(save));
            }, true);
            $rootScope.settings.shared = false;
            $rootScope.settings.hasSaved = false;
        };

        $scope.copyAll = function () {

        };
    }];

    app.controller('sharedController', sharedController);
} ());
