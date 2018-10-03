/*
Registers an angular module named "app.core".
In this module we list our angular as well as any third party plugins we'll be using in this application.
*/
((): void => {
    "use strict";

    angular.module("app.core", [
        /*modules or Libraries used*/
        'ui.router',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.pinning',
        'ui.grid.resizeColumns',
        'ui.grid.autoResize',
        'ui.grid.exporter',
        'ui.grid.selection',
        //For multiselect control we are using angularjs-Dropdown-Multiselect plugin.
        'angularjs-dropdown-multiselect',
    ]);
})();