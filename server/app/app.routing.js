app.config(function($routeProvider) {
    $routeProvider
    .when("/thread/:id", {
        templateUrl : "thread.html",
        controller : "thread.controller"
    })
    .when("/", {
        templateUrl : "home.html",
        controller : "home.controller"
    })
});