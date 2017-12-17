/**
 * @Author: Drop
 * @Creation: 12/16/2017 5:34 PM (Revisiting Snoke)
 */
(function () {
  var app = angular.module('csgo-radio');

  var savesController = ['$scope', '$rootScope', '$mdDialog', 'messagesService', 'uiService', function ($scope, $rootScope, $mdDialog, messagesService, uiService) {
    $scope.saves = $rootScope.saves;
    $scope.load = function ($event, UID) {
      messagesService.importMessages($rootScope.saves[UID].save,false,false);
      $mdDialog.hide();
    };
  }];

  app.controller('savesController', savesController);
}());
