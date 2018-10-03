//JS IIFE
((): void => {
    "use strict";

    /*
    Angular Route Configuration class.
    */
    angular.module("app").config(routeConfig);

    //Injecting the dependencies
    routeConfig.$inject = ["$stateProvider"];

    function routeConfig($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('index', {
            url: "/index",
            templateUrl: "app/index.html",
            controller: "indexController",
            controllerAs: "idxc"
        })
    }
});