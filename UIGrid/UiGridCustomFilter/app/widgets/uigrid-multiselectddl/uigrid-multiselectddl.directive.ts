module app.widgets.uigrid.multiselectddl {
    "use strict";

    interface IDropDown {
        id: number;
        label: string;
        $$hashKey?: string;
    }

    /**
     * DropDown
     */
    class DropDown implements IDropDown {
        id: number;
        label: string;
        $$hashKey: string;

        constructor(id: number, label: string, $$hashKey?: string) {
            this.id = id;
            this.label = label;
            this.$$hashKey = $$hashKey
        }
    }


    interface IMultiSelectDDLDirectiveScope extends ng.IScope {
        selectedDataModel: IDropDown[];
        eventListeners: Object;
        extraSettings: Object;
        checkboxes: boolean;
        colFilter: uiGrid.IFilterOptions;
    }

    /**
     * MultiSelectDDL Directive Controller Class.
     */
    class MultiSelectDDLController {

        static $inject = ["$scope", "uiGridConstants"];
        constructor(private $scope: IMultiSelectDDLDirectiveScope, private uiGridConstants: uiGrid.IUiGridConstants) {
            let self = this;

            //initializing the selectedModel to empty array
            $scope.selectedDataModel = [];

            //binding the events
            $scope.eventListeners = {
                /**
                 * Func for item Select
                 * @param checkedItem Selected Item Label
                */
                onItemSelect: (checkedItem: string) => {
                    self.doFilter();
                },

                /**
                 * Func for item Deselect
                 * @param uncheckedItem Deselected Item Label
                */
                onItemDeselect: (unCheckedItem: string) => {
                    self.doFilter();
                },

                /**
                * Func for select all elements
                */
                onSelectAll: () => {
                    self.doFilter();
                },

                /**
                * Func for deselecting all elements
                */
                onDeselectAll: (sendEvent: any) => {
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
            }
        }

        /**
         * Func for filter UI-Grid Data
         */
        doFilter() {
            let self = this;
            self.$scope.colFilter.term = self.$scope.selectedDataModel.map(function (element) { return element.label }).join(",")
            self.$scope.colFilter.condition = new RegExp(self.$scope.selectedDataModel.map(function (element) { return element.label }).join("|"));
        }
    }

    /**
     * AngularJs MultiSelect DropDown Directive 
     */
    export class MultiSelectDDLDirective implements ng.IDirective {

        //Restricting the directive to be used as either "element" or "attribute"
        public restrict: string = "EA";

        //view for the directive
        public templateUrl: string = "widgets/uigrid-multiselectddl/uigrid-multiselectddl.html";

        //replace property of directive
        public replace = false;

        //default scope i.e. Shared scope
        public scope = false;

        //controller for the directive
        controller = MultiSelectDDLController;

        //default constructor
        constructor() {
        }

        static instance(): ng.IDirective {
            return new MultiSelectDDLDirective();
        }
    }
    //Registering the directive
    angular.module("app.widgets").directive("app.widgets.uigrid.multiselect", MultiSelectDDLDirective.instance);
}