/**
 * @Author: Drop
 * @Creation: 7/25/2016 2:17 PM (The living daylights)
 */
(function () {
    var app = angular.module("csgo-radio");

    var loadingController = function ($scope, $rootScope, messagesService) {
        var messagesLoaded = false;
        var customLoaded = false;
        var isLoaded = function () {
            if (messagesLoaded === true && customLoaded === true) {
                $rootScope.init.loaded = true;
                angular.element(document).find(".wrapper").removeClass("hidden"); //It's necessary because the class is hardcoded into the html. Otherwise it would break the loader
            }
        };
        var onMessagesLoad = function (data) {
            $rootScope.model.messages = []; // array which you have
            for (var item in data) {
                data[item].disabled = false;
                $rootScope.model.messages.push(data[item]);
            }
            $rootScope.init.messages = data;
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
    app.controller("loadingController", loadingController);
} ());