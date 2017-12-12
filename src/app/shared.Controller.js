/**
 * @Author: Drop
 * @Creation: 8/3/2016 9:34 PM (Radagast the brown)
 */
(function () {
    var app = angular.module('csgo-radio');

    var sharedController = ['$scope', '$rootScope', 'messagesService', function ($scope, $rootScope, messagesService) {

        $scope.save = function () {
            $rootScope.$watch('model', messagesService.save, true);
            $rootScope.settings.shared = false;
            $rootScope.settings.hasSaved = false;
        };

        $scope.copyAll = function () {
            var groups = ['standard', 'group', 'report'];
            for (var group in groups) {
                var group = groups[group];
                for (var custom in $rootScope.model[group]) {
                    if (typeof $rootScope.model[group][custom] !== 'string') {
                        if ($rootScope.model[group][custom].type === 'imported') {
                            $rootScope.model[group][custom].UID = $rootScope.model[group][custom].text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor((Math.random() * 100) + 1);
                            $rootScope.model[group][custom].type = 'custom';
                            $rootScope.model[group][custom].disabled = true;
                            $rootScope.model[group][custom].label = $rootScope.model[group][custom].text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
                            $rootScope.model.custom[$rootScope.model[group][custom].UID] = $rootScope.model[group][custom];
                        }
                    }
                }
            }
        };
    }];

    app.controller('sharedController', sharedController);
} ());
