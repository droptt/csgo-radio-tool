/**
 * @Author: Drop
 * @Creation: 7/25/2016 2:19 PM (Tomorrow never dies)
 */

var app = angular.module('csgo-radio', ['pascalprecht.translate', 'ngCookies', 'angular-growl', 'dndLists', 'ui.bootstrap', 'angularInlineEdit', 'LocalStorageModule']);

app.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '',
        suffix: '.json'
    })
        .uniformLanguageTag('bcp47')
        .determinePreferredLanguage()
        .fallbackLanguage('en-US')
        .useLocalStorage();
})
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('');
    })
	.config(['growlProvider', function (growlProvider) {
		growlProvider.globalTimeToLive(5000);
		growlProvider.globalEnableHtml(true);
	}])
    .run(function ($rootScope) {
		$rootScope.init = { 'loaded': false };
		$rootScope.settings = {
			'allowed_types': ['none', 'and'], 'msg_type': 'message', 'radioMenu': {
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
			}, "boxes": Array("StandardRadio", "GroupRadio", "ReportRadio")
		};
		$rootScope.settings.version = 2.0;
		$rootScope.model = { 'standard': [], 'group': [], 'report': [], 'Titles': [null, null, null] };
	});