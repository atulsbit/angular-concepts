var app;
(function (app) {
    var modules;
    (function (modules) {
        /**
         * Used for converting boolean string representation to Boolean value
         */
        var StringToBooleanConverter = (function () {
            function StringToBooleanConverter() {
            }
            StringToBooleanConverter.Convert = function (value) {
                return (value === "true");
            };
            return StringToBooleanConverter;
        }());
        var IndexController = (function () {
            function IndexController($scope, $http, $window, uiGridConstants, uiGridExporterConstants, uiGridExporterService) {
                this.$scope = $scope;
                this.$http = $http;
                this.$window = $window;
                this.uiGridConstants = uiGridConstants;
                this.uiGridExporterConstants = uiGridExporterConstants;
                this.uiGridExporterService = uiGridExporterService;
                var self = this;
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
                    onRegisterApi: function (gridApi) {
                        self.gridApi = gridApi;
                    }
                };
                //load the grid settings
                self.getGridSettings();
            }
            /**
             * GET the ui-Grid settings
             */
            IndexController.prototype.getGridSettings = function () {
                var self = this;
                //forming the data.json url
                var serviceUrl = self.$window.location.protocol + '//' + self.$window.location.hostname + (self.$window.location.port ? ':' + self.$window.location.port : '') + "/app/modules/grid.settings.json";
                self.$http.get(serviceUrl).then(function (successCallBack) {
                    if (successCallBack.status === 200 && successCallBack.data != null) {
                        self.gridColumnDefinitions = successCallBack.data;
                        self.bindData();
                    }
                });
            };
            /**
             * GET's the Employee Data
             */
            IndexController.prototype.bindData = function () {
                var self = this;
                //forming the data.json url
                var serviceUrl = self.$window.location.protocol + '//' + self.$window.location.hostname + (self.$window.location.port ? ':' + self.$window.location.port : '') + "/app/modules/data.json";
                //initially setting the columnDefs to an empty array;
                self.gridOptions.columnDefs = [];
                self.$http.get(serviceUrl).then(function (successCallBack) {
                    if (successCallBack.status === 200 && successCallBack.data != null) {
                        console.log(successCallBack.data);
                        self.dataSource = successCallBack.data;
                        self.configureGrid();
                    }
                });
            };
            /**
             * Configuring the Grid
             */
            IndexController.prototype.configureGrid = function () {
                var self = this;
                var props = Object.keys(self.dataSource[0]);
                console.log(props);
                var _loop_1 = function(prop) {
                    //Defining column definition
                    var colDef = {
                        name: prop,
                        field: prop,
                        enablePinning: false,
                        cellTooltip: true,
                        enableColumnResizing: true
                    };
                    $.each(self.gridColumnDefinitions, function (index, jsonObject) {
                        if (jsonObject.name === prop) {
                            colDef.displayName = jsonObject.displayName;
                            colDef.cellClass = jsonObject.cellClass;
                            colDef.cellFilter = jsonObject.cellFilter;
                            colDef.name = jsonObject.name;
                            colDef.field = jsonObject.field;
                            colDef.enableHiding = false;
                            colDef.cellTooltip = true;
                            if (StringToBooleanConverter.Convert(jsonObject.enableFiltering)) {
                                var options_1 = [];
                                //iterating over the dataSource for building options dynamically
                                $.each(self.dataSource, function (index, objModel) {
                                    if (objModel[prop] != null) {
                                        if (options_1.length == 0) {
                                            options_1.push({ value: objModel[prop], label: objModel[prop] });
                                        }
                                        else {
                                            var optionAlreadyExists_1 = false;
                                            $.each(options_1, function (idx, objOption) {
                                                if (objOption.label == objModel[prop]) {
                                                    optionAlreadyExists_1 = true;
                                                    //breaking the looop
                                                    return false;
                                                }
                                            });
                                            if (!optionAlreadyExists_1) {
                                                options_1.push({ value: objModel[prop], label: objModel[prop] });
                                            }
                                        }
                                    }
                                });
                                //sorting the options array
                                options_1 = options_1.sort(function (a, b) {
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
                                    selectOptions: options_1,
                                };
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
                };
                for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                    var prop = props_1[_i];
                    _loop_1(prop);
                }
                //binding the datasource to the grid data.
                self.gridOptions.data = self.dataSource;
            };
            IndexController.$inject = ["$scope", "$http", "$window", "uiGridConstants", "uiGridExporterConstants", "uiGridExporterService"];
            return IndexController;
        }());
        //Registering the angular Controller
        angular.module("app.modules").controller("indexController", IndexController);
    })(modules = app.modules || (app.modules = {}));
})(app || (app = {}));
