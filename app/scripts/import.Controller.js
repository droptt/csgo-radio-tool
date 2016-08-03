/**
 * @Author: Drop
 * @Creation: 8/2/2016 9:21 PM ()
 */
(function () {
    var app = angular.module('csgo-radio');

    var importController = ['$scope', '$rootScope', '$uibModalInstance', 'messagesService', 'VDFService', function ($scope, $rootScope, $uibModalInstance, messagesService, VDFService) {

        $scope.import = { copy: true };

        var Import = function (model) {
            var parse = VDFService.parse(model.file);
            if (typeof parse["RadioPanel.txt"] !== "undefined" && parse !== false) {
                var obj = {};
                for (var group in parse["RadioPanel.txt"].Groups) {
                    if (group === "group" || group === "report" || group === "standard") {
                        obj[group] = [];
                        for (var msg in parse["RadioPanel.txt"].Groups[group].Commands) {
                            var cMsg = parse["RadioPanel.txt"].Groups[group].Commands[msg];
                            if ($rootScope.model.messages.hasOwnProperty(cMsg.cmd) === true) {
                                obj[group].push(cMsg.cmd);
                            } else {
                                obj[group].push(messagesService.checkHtmlTags(cMsg));
                            }
                        }
                    }
                }
                obj["titles"] = Array((parse["RadioPanel.txt"].Groups.standard.title === "#SFUI_CommandRadio") ? null : parse["RadioPanel.txt"].Groups.standard.title,
                    (parse["RadioPanel.txt"].Groups.group.title === "#SFUI_StandardRadio") ? null : parse["RadioPanel.txt"].Groups.group.title,
                    (parse["RadioPanel.txt"].Groups.report.title === "#SFUI_ReportRadio") ? null : parse["RadioPanel.txt"].Groups.report.title);
                messagesService.importMessages({ "StandardRadio": obj.standard, "GroupRadio": obj.group, "ReportRadio": obj.report, "Titles": obj.titles }, true, false, model.copy);
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
        };

        $scope.ok = function () {
            Import($scope.import);
            $uibModalInstance.close('ok');
        };
    }];
    app.controller('importController', importController);
} ());
