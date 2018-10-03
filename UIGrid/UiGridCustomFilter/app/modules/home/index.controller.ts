module app.modules {

    /**
     * Used for converting boolean string representation to Boolean value
     */
    class StringToBooleanConverter {
        static Convert(value: string): boolean {
            return (value === "true");
        }
    }

    /**
    * Dropdown option and value
    */
    interface IOption {
        value: string;
        label: string;
    }

    /*
        Employee Model
    */
    interface IEmployee {
        empId: number;
        name: string;
        age: number;
        designation: string;
        expertiseIn: string;
        salary: number;
    }

    /**
        UiGrid Column Definition.
        You can add more properties to this class as required which may include "custom Properites" as well as "uiGrid Col definition" properties
    */
    interface IUiGridColDefinition {
        //#region uiGrid Properties"
        name: string;
        displayName: string;
        field: string;
        filterHeaderTemplate?: string;
        cellClass?: string;
        cellFilter?: string;
        enableFiltering?: string;
        //#endregion

        //#region Custom Properties
        useCustomFilterHeaderTemplate?: string;
        //#endregion 
    }

    interface IIndexController {
        gridApi: uiGrid.IGridApi;
        gridOptions: uiGrid.IGridOptions;

        dataSource: IEmployee[];
        gridColumnDefinitions: IUiGridColDefinition[];
        bindData(): void;
        getGridSettings(): void;
        configureGrid(): void;
    }

    /**
     * Index Controller 
     */
    class IndexController implements IIndexController {

        gridOptions: uiGrid.IGridOptions;
        gridApi: uiGrid.IGridApi;

        dataSource: IEmployee[];
        gridColumnDefinitions: IUiGridColDefinition[];

        static $inject = ["$scope", "$http", "$window", "uiGridConstants", "uiGridExporterConstants", "uiGridExporterService"];
        constructor(private $scope: ng.IScope, private $http: ng.IHttpService, private $window: ng.IWindowService, private uiGridConstants: uiGrid.IUiGridConstants,
            private uiGridExporterConstants: uiGrid.exporter.IUiGridExporterConstants, private uiGridExporterService: uiGrid.exporter.IGridExporterApi) {
            let self = this;
            //initializing the dataSource to empty array
            self.dataSource = [];
            self.gridColumnDefinitions = [];

            //Initializing ui-Grid Options
            self.gridOptions = {
                excludeProperties: ['__metadata'],
                enableSorting: true,
                showGridFooter: true,
                showColumnFooter: true,
                enableFiltering: true,
                enableColumnResizing: false,
                enablePinning: false,
                enableHorizontalScrollbar: true,
                minRowsToShow: 10,
                enablePagination: true,
                paginationPageSizes: [10, 20, 30],
                paginationPageSize: 10,
                rowHeight: 22,
                multiSelect: true,
                onRegisterApi: function (gridApi: uiGrid.IGridApi) {
                    self.gridApi = gridApi;
                }
            }

            //load the grid settings
            self.getGridSettings();
        }

        /**
         * GET the ui-Grid settings
         */
        getGridSettings(): void {
            let self = this;
            //forming the data.json url
            let serviceUrl = self.$window.location.protocol + '//' + self.$window.location.hostname + (self.$window.location.port ? ':' + self.$window.location.port : '') + "/app/modules/home/grid.settings.json";

            self.$http.get(serviceUrl).then((successCallBack: ng.IHttpPromiseCallbackArg<{}>) => {
                if (successCallBack.status === 200 && successCallBack.data != null) {
                    self.gridColumnDefinitions = <IUiGridColDefinition[]>successCallBack.data;
                    self.bindData();
                }
            });
        }

        /**
         * GET's the Employee Data
         */
        bindData(): void {

            let self = this;
            //forming the data.json url
            let serviceUrl = self.$window.location.protocol + '//' + self.$window.location.hostname + (self.$window.location.port ? ':' + self.$window.location.port : '') + "/app/modules/home/data.json";

            //initially setting the columnDefs to an empty array;
            self.gridOptions.columnDefs = [];

            self.$http.get(serviceUrl).then((successCallBack: ng.IHttpPromiseCallbackArg<{}>) => {
                if (successCallBack.status === 200 && successCallBack.data != null) {
                    console.log(successCallBack.data);
                    self.dataSource = <IEmployee[]>successCallBack.data;
                    self.configureGrid();
                }
            });
        }

        /**
         * Configuring the Grid
         */
        configureGrid(): void {
            let self = this;
            let props = Object.keys(self.dataSource[0]);
            console.log(props);
            for (let prop of props) {
                //Defining column definition
                let colDef: uiGrid.IColumnDefOf<any> = {
                    name: prop,
                    field: prop,
                    enablePinning: false,
                    cellTooltip: true,
                    enableColumnResizing: true,
                    enableHiding: false
                }

                $.each(self.gridColumnDefinitions, function (index, jsonObject) {
                    if (jsonObject.name == prop) {
                        colDef.displayName = jsonObject.displayName;
                        colDef.cellClass = jsonObject.cellClass;
                        colDef.cellFilter = jsonObject.cellFilter;

                        if (StringToBooleanConverter.Convert(jsonObject.enableFiltering)) {
                            let options: IOption[] = [];

                            //iterating over the dataSource for building options dynamically
                            $.each(self.dataSource, function (index, objModel) {
                                if (objModel[prop] != null) {
                                    if (options.length == 0) {
                                        options.push({ value: objModel[prop], label: objModel[prop] });
                                    }
                                    else {
                                        let optionAlreadyExists: boolean = false;
                                        $.each(options, function (idx, objOption) {
                                            if (objOption.label == objModel[prop]) {
                                                optionAlreadyExists = true;
                                                //breaking the looop
                                                return false;
                                            }
                                        });
                                        if (!optionAlreadyExists) {
                                            options.push({ value: objModel[prop], label: objModel[prop] });
                                        }
                                    }
                                }
                            });

                            //sorting the options array
                            options = options.sort((a, b) => {
                                if (a.label > b.label) {
                                    return 1;
                                }
                                if (a.label < b.label) {
                                    return -1;
                                }
                                return 0;
                            });

                            //forming the column filter
                            colDef.filter = {
                                term: '',
                                placeholder: jsonObject.name,
                                selectOptions: options,
                            }

                            if (StringToBooleanConverter.Convert(jsonObject.useCustomFilterHeaderTemplate)) {
                                //overriding the default template
                                colDef.filterHeaderTemplate = jsonObject.filterHeaderTemplate;
                            }
                            else {
                                //use the default template for dropdown filter i.e.single select
                                colDef.filter.type = self.uiGridConstants.filter.SELECT;
                            }
                        }
                        else {
                            colDef.enableFiltering = false;
                        }
                        //for breaking the $.each loop once we are done with the current property  been iterated
                        return false;
                    }
                });
                //adding the column definition to the gridOption
                self.gridOptions.columnDefs.push(colDef);
            }
            //binding the datasource to the grid data.
            self.gridOptions.data = self.dataSource;
        }
    }

    //Registering the angular Controller with angular module named "app.modules"
    angular.module("app.modules").controller("indexController", IndexController);
}