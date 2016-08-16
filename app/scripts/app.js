/**
 * @Author: Drop
 * @Creation: 7/25/2016 2:19 PM (Tomorrow never dies)
 */

var app = angular.module('csgo-radio', ['pascalprecht.translate',
  'ngCookies',
  'dndLists',
  'angularInlineEdit',
  'ngMaterial',
  'ngMessages',
  'mdColorPicker',
  'ngSanitize',
  'angulartics',
  'angulartics.google.analytics',
  'LocalStorageModule'
]);

app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '',
    suffix: '.json'
  })
    .uniformLanguageTag('bcp47')
    .determinePreferredLanguage()
    .fallbackLanguage('en-US')
    .useLocalStorage();
}]).config(['localStorageServiceProvider', function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('');
}]).config(function ($analyticsProvider) {
  $analyticsProvider.virtualPageviews(false);
}).run(['$rootScope', function ($rootScope) {
  $rootScope.init = {
    'loaded': false
  };
  $rootScope.settings = {
    'allowed_types': ['none', 'and'],
    'msg_type': 'message',
    'radioMenu': {
      'RadioPanel.txt': {
        'Groups': {
          'standard': {
            'hotkey': '1',
            'title': '#SFUI_CommandRadio',
            'timeout': '5',
            'Commands': {},
          },
          'group': {
            'hotkey': '2',
            'title': '#SFUI_StandardRadio',
            'timeout': '5',
            'Commands': {},
          },
          'report': {
            'hotkey': '3',
            'title': '#SFUI_ReportRadio',
            'timeout': '5',
            'Commands': {}
          }
        }
      }
    },
    'boxes': Array('StandardRadio', 'GroupRadio', 'ReportRadio')
  };
  $rootScope.settings.version = 20;
  $rootScope.model = {
    'standard': [],
    'group': [],
    'report': [],
    'Titles': [null, null, null]
  };
}]);
