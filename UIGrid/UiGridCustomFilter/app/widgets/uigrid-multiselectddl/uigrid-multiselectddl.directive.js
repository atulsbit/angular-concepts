var app;
(function (app) {
    var widgets;
    (function (widgets) {
        var uigrid;
        (function (uigrid) {
            var multiselectddl;
            (function (multiselectddl) {
                "use strict";
                /**
                 * DropDown
                 */
                var DropDown = (function () {
                    function DropDown(id, label, $$hashKey) {
                        this.id = id;
                        this.label = label;
                        this.$$hashKey = $$hashKey;
                    }
                    return DropDown;
                }());
                /**
                 * MultiSelectDDL Directive Controller Class.
                 */
                var MultiSelectDDLController = (function () {
                    function MultiSelectDDLController($scope, uiGridConstants) {
                        this.$scope = $scope;
                        this.uiGridConstants = uiGridConstants;
                        var self = this;
                        //initializing the selectedModel to empty array
                        $scope.selectedDataModel = [];
                        //binding the events
                        $scope.eventListeners = {
                            /**
                             * Func for item Select
                             * @param checkedItem Selected Item Label
                            */
                            onItemSelect: function (checkedItem) {
                                self.doFilter();
                            },
                            /**
                             * Func for item Deselect
                             * @param uncheckedItem Deselected Item Label
                            */
                            onItemDeselect: function (unCheckedItem) {
                                self.doFilter();
                            },
                            /**
                            * Func for select all elements
                            */
                            onSelectAll: function () {
                                self.doFilter();
                            },
                            /**
                            * Func for deselecting all elements
                            */
                            onDeselectAll: function (sendEvent) {
                                //emptying the array
                                self.$scope.selectedDataModel.splice(0, self.$scope.selectedDataModel.length);
                                self.doFilter();
                            }
                        };
                        //extra Settings for the MultiSelect control
                        $scope.extraSettings = {
                            externalIdProp: '',
                            displayProp: 'label',
                            idProp: 'value',
                            showCheckAll: true,
                            showUncheckAll: true,
                            buttonDefaultText: "",
                            scrollable: false,
                            buttonClasses: "btn filterBtn"
                        };
                    }
                    /**
                     * Func for filter UI-Grid Data
                     */
                    MultiSelectDDLController.prototype.doFilter = function () {
                        var self = this;
                        self.$scope.colFilter.term = self.$scope.selectedDataModel.map(function (element) { return element.label; }).join(",");
                        self.$scope.colFilter.condition = new RegExp(self.$scope.selectedDataModel.map(function (element) { return element.label; }).join("|"));
                    };
                    MultiSelectDDLController.$inject = ["$scope", "uiGridConstants"];
                    return MultiSelectDDLController;
                }());
                /**
                 * AngularJs MultiSelect DropDown Directive
                 */
                var MultiSelectDDLDirective = (function () {
                    //default constructor
                    function MultiSelectDDLDirective() {
                        //Restricting the directive to be used as either "element" or "attribute"
                        this.restrict = "EA";
                        //view for the directive
                        this.templateUrl = "widgets/uigrid-multiselectddl/uigrid-multiselectddl.html";
                        //replace property of directive
                        this.replace = false;
                        //default scope i.e. Shared scope
                        this.scope = false;
                        //controller for the directive
                        this.controller = MultiSelectDDLController;
                    }
                    MultiSelectDDLDirective.instance = function () {
                        return new MultiSelectDDLDirective();
                    };
                    return MultiSelectDDLDirective;
                }());
                multiselectddl.MultiSelectDDLDirective = MultiSelectDDLDirective;
                //Registering the directive
                angular.module("app.widgets").directive("app.widgets.uigrid.multiselect", MultiSelectDDLDirective.instance);
            })(multiselectddl = uigrid.multiselectddl || (uigrid.multiselectddl = {}));
        })(uigrid = widgets.uigrid || (widgets.uigrid = {}));
    })(widgets = app.widgets || (app.widgets = {}));
})(app || (app = {}));
