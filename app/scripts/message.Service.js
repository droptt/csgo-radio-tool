/**
 * @Author: Drop
 * @Creation: 7/25/2016 4:05 PM (Welcome to Jurassic Park)
 */
(function () {

    var messagesService = function ($http) {

        var getMessages = function () {
            return $http.get("radio.json")
                .then(function (response) {
                    console.log(response);
                    return response.data;
                });
        };
        var getCustom = function () {
            return $http.get("custom.json")
                .then(function (response) {
                    return response.data;
                });
        };

        return {
            getMessages: getMessages,
            getCustom: getCustom
        };

    },
    module = angular.module("csgo-radio");
    module.factory("messagesService", messagesService);
} ());
