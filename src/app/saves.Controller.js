/**
 * @Author: Drop
 * @Creation: 12/16/2017 5:34 PM (Revisiting Snoke)
 */
(function () {
  var app = angular.module('csgo-radio');

  var savesController = ['$scope', '$rootScope', '$mdDialog', 'messageService', 'uiService', function ($scope, $rootScope, $mdDialog, messageService, uiService) {
    $scope.saves = $rootScope.saves;
    
  }];

  app.controller('savesController', savesController);
}());
