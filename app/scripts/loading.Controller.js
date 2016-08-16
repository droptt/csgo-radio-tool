/**
 * @Author: Drop
 * @Creation: 7/25/2016 2:17 PM (The living daylights)
 */
(function () {
  var app = angular.module('csgo-radio');

  var loadingController = ['$scope', '$rootScope', 'messagesService', 'localStorageService', '$filter', '$location', '$analytics', '$mdToast', function ($scope, $rootScope, messagesService, localStorageService, $filter, $location, $analytics, $mdToast) {
    $scope.loading_state = 'Loading Assets';
    var isJson = function (str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    };

    var init = function () {
      var loaded = false,
        shared = false;
      if (localStorageService.isSupported) { //TODO: Verify if localstorage operations were successfuly executed
        if (localStorageService.get('customVersion') !== null || localStorageService.get('version') !== null) {
          $rootScope.settings.newUser = false;

          if ($rootScope.settings.version === localStorageService.get('version')) { //Don't show new version notification
            $rootScope.settings.versionNotification = false;
          } else {
            $rootScope.settings.versionNotification = true;
            localStorageService.set('version', $rootScope.settings.version);
          }
        } else {
          $rootScope.settings.newUser = true;
          $rootScope.settings.versionNotification = true;
          localStorageService.set('version', $rootScope.settings.version);
          localStorageService.set('customVersion', 2); //TODO: customVersion is not supposed to be hardcoded.
        }
        if (localStorageService.get('custom') !== null) {
          var custom = angular.fromJson(localStorageService.get('custom'));
          if (custom.constructor === Array) {
            $analytics.eventTrack('Legacy Custom List', {
              category: 'radio_tool',
            });
            messagesService.importOldCustom(custom);
          } else {
            messagesService.importCustom(custom);
          }
        } else {
          $rootScope.model.custom = $rootScope.init.custom;
          $rootScope.$watch('model.custom', messagesService.customSave, true);
        }
        var hashUrl = decodeURIComponent(window.location.hash.replace('#/', '').replace('##', ''));
        if (isJson(hashUrl) === true) {
          if (hashUrl !== JSON.stringify(localStorageService.get('saved'))) {
            $analytics.eventTrack('Shared Link loaded', {
              category: 'radio_tool',
            });
            messagesService.importMessages(JSON.parse(hashUrl), false, true, false);
            loaded = true;
            shared = true;
            $rootScope.settings.shared = true;
            $rootScope.settings.hasSaved = (localStorageService.get('saved') === null) ? false : true;
          }
        }
        if (localStorageService.get('saved') !== null && loaded === false) {
          var saved = angular.fromJson(localStorageService.get('saved'));
          messagesService.importMessages(saved, false, false);
          loaded = true;
        } else {
          if (shared === false && loaded === false) {
            messagesService.default();
            loaded = true;
          }
        }
      }
    };
    var messagesLoaded = false;
    var customLoaded = false;
    var isLoaded = function () {
      if (messagesLoaded === true && customLoaded === true) {
        $rootScope.init.loaded = true;
        angular.element(document).find('.wrapper').removeClass('hidden'); //It's necessary because the class is hardcoded into the html. Otherwise it would break the loader
        init();
      }
    };
    var onMessagesLoad = function (data) {
      $rootScope.model.messages = data;
      messagesLoaded = true;
      isLoaded();
    };
    var onCustomLoad = function (data) {
      $rootScope.init.custom = data;
      customLoaded = true;
      isLoaded();
    };
    var onCommandLoad = function (data) {
      $rootScope.init.commands = data;
      $rootScope.init.Commands = true;
    };
    var onFail = function (reason) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(reason.data + ': ' + reason.statusText + '. Please Reload the page or contact me.')
          .position('top right')
          .hideDelay(10000)
      );
      $analytics.eventTrack('Error: ' + reason.data, {
        category: 'radio_tool',
        label: reason.statusText + ': ' + reason.stauts
      });
      $scope.loading_state = 'Couldn\'t load Messages.';
      $scope.error = true;
    };
    var onCmdFail = function (reason) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Unable to fetch commands list. Autocomplete is disabled.')
          .position('top right')
          .hideDelay(10000)
      );
      $analytics.eventTrack('Error: ' + reason.data, {
        category: 'radio_tool',
        label: reason.statusText + ': ' + reason.stauts
      });
      $scope.error = true;
    }
    $scope.loading_state = 'Loading Data';
    messagesService.getMessages().then(onMessagesLoad, onFail);
    messagesService.getCustom().then(onCustomLoad, onFail);
    messagesService.getCommand().then(onCommandLoad, onCmdFail);
  }];
  app.controller('loadingController', loadingController);
} ());
