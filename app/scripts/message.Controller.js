/**
 * @Author: Drop
 * @Creation: 7/26/2016 2:46 PM (Polyjuice Potion)
 */
(function () {
    var app = angular.module("csgo-radio");

    var messageController = function ($scope, $rootScope) {
        $scope.removeMessage = function (list, message) {
            console.log(arguments);
        };
        $scope.logDrop = function (event, index, item) {
            if (event.target.attributes[0].nodeName === "data-list-name") { //Checks if target is the list
                var targetName = event.target.attributes[0].nodeValue;
                console.log("Target is the List");
            } else if (event.target.parentNode.attributes[0].nodeName === "data-list-name") { //In case element wasn't dropped on the list
                var targetName = event.target.parentNode.attributes[0].nodeValue;
                console.log("Target is a child element");
            } else if (event.target.parentNode.parentNode.attributes[0].nodeName === "data-list-name") { //Never trust the user, they said.
                var targetName = event.target.parentNode.parentNode.attributes[0].nodeValue;
                console.log("Target is second child element");
            }
            if ($rootScope.model[targetName].length > 8) {
                console.log("Target is full");
                return false;
            }
            console.log("k then");
            return item;
        };
    }
    app.controller("messageController", messageController);
} ());
