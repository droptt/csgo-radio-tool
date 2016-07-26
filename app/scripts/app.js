/**
 * @Author: Drop
 * @Creation: 7/25/2016 2:19 PM (Tomorrow never dies)
 */

var app = angular.module("csgo-radio", ['pascalprecht.translate', 'dndLists']);

app.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '',
        suffix: '.json'
    }).preferredLanguage('en');
}).run(function ($rootScope) {
    $rootScope.init = {"loaded": false};
    $rootScope.settings = {"allowed_types": ["none", "and"], "msg_type": "message"};
    $rootScope.settings.version = 2.0;
    $rootScope.model = { "standard": [], "group": [], "report": [] };
});