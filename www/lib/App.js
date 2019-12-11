var app = angular.module("App", 
[
    "ngRoute",
    'app.controller',
    'app.db',
    'app.compile'
]);
app.config(function($routeProvider) 
{
    $routeProvider
    .when("/", 
    {
        templateUrl : "html/AnaSayfa.html"
    })
    .when("/RafTanimlari", 
    {
        templateUrl : "html/RafTanimlari.html"
    })
});
