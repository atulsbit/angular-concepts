/*
Main application file. Here we reigsters the sub modules i.e. core, widgets etc.
*/
(function () {
    "use strict";
    angular.module("app", [
        /*application dependencies*/
        "app.core",
        "app.widgets",
        "app.modules",
    ]);
})();
