/**
 * @Author: Drop
 * @Creation: 7/25/2016 2:17 PM (The living daylights)
 */
(function () {
    var app = angular.module('csgo-radio');

    var loadingController = ['$scope', '$rootScope', 'messagesService', 'localStorageService', 'growl', '$filter', '$location', function ($scope, $rootScope, messagesService, localStorageService, growl, $filter, $location) {
        var init = function () {
            console.log($location.hash())
            growl.info('<h4><i class=\'glyphicon glyphicon-info-sign\'></i> WORD </h4> <b>INIT</b>');
            if (localStorageService.isSupported) { //TODO: Verify if localstorage operations were successfuly executed
                growl.info('<h4><i class=\'glyphicon glyphicon-info-sign\'></i> WORD </h4> <div>LOCALSTORAGE IS SUPPORTED</div>');
                if (localStorageService.get('customVersion') !== null || localStorageService.get('version') !== null) {
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
                    localStorageService.set('version', $rootScope.settings.version);
                    localStorageService.set('customVersion', 2); //TODO: customVersion is not supposed to be hardcoded.
                }
                if (localStorageService.get('saved') !== null) {
                    var saved = angular.fromJson(localStorageService.get('saved'));
                    messagesService.importMessages(saved, false, false);
                } else {
                    $rootScope.$watch('model', function (model) { //Auto save
                        if (localStorageService.isSupported) {
                            localStorageService.set('saved', {
                                'StandardRadio': $rootScope.model.standard, 'GroupRadio': $rootScope.model.group, 'ReportRadio': $rootScope.model.report, 'Titles': [
                                    ($rootScope.model.Titles[0] === $filter('translate')('boxes.title_0')) ? null : $rootScope.model.Titles[0],
                                    ($rootScope.model.Titles[1] === $filter('translate')('boxes.title_1')) ? null : $rootScope.model.Titles[1],
                                    ($rootScope.model.Titles[2] === $filter('translate')('boxes.title_2')) ? null : $rootScope.model.Titles[2],
                                ]
                            });
                        }
                    }, true);
                    $rootScope.model.Titles = [$filter('translate')('boxes.title_0'), $filter('translate')('boxes.title_1'), $filter('translate')('boxes.title_2')];
                }
                if (localStorageService.get('custom') !== null) {
                    var custom = angular.fromJson(localStorageService.get('custom'));
                    messagesService.importCustom(custom);
                } else {
                    $rootScope.$watch('model.custom', function () { //Auto save custom
                        if (localStorageService.isSupported) {
                            localStorageService.set('custom', $rootScope.model.custom);
                        }
                    }, true);
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
    }];
    app.controller('loadingController', loadingController);
} ());