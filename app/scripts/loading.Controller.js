/**
 * @Author: Drop
 * @Creation: 7/25/2016 2:17 PM (The living daylights)
 */
(function () {
    var app = angular.module('csgo-radio');

    var loadingController = function ($scope, $rootScope, messagesService, localStorageService, growl) {
        var init = function () {
            //growl.addInfoMessage("<b>INIT</b>");
            if (localStorageService.isSupported) { //TODO: Verify if localstorage operations were successfuly executed
                //growl.addInfoMessage("<h4><i class='glyphicon glyphicon-info-sign'></i> Random Information </h4> <span>LOCALSTORAGE IS SUPPORTED</span>");
                if (typeof localStorageService.get('customVersion') !== null || typeof localStorageService.get('version') !== null) {
                    $rootScope.settings.newUser = false;

                    if ($rootScope.settings.version === localStorageService.get('version')) {//Don't show new version notification
                        $rootScope.settings.versionNotification = false;
                    } else {
                        $rootScope.settings.versionNotification = true;
                        localStorageService.set('version', $rootScope.settings.version);
                    }
                } else {
                    $rootScope.settings.newUser = true;
                    $rootScope.settings.versionNotification = true;
                    localStorageService.set('version', $rootScope.settings.version).set('customVersion', 2); //TODO: customVersion is not supposed to be hardcoded.
                }
                if (typeof localStorageService.get('saved') !== null) {
                    var saved = angular.fromJson(localStorageService.get('saved'));
                    messagesService.importMessages(saved, false, false);
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
            $rootScope.model.custom = data;
            $rootScope.init.custom = data;
            customLoaded = true;
            isLoaded();
        };
        var onFail = function (reason, type) {
            //TODO: ERROR HANDLER
        };
        messagesService.getMessages().then(onMessagesLoad, onFail);
        messagesService.getCustom().then(onCustomLoad, onFail);
    }
    app.controller('loadingController', loadingController);
} ());