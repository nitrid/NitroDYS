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
    .when("/RafKategoriTanimlari", 
    {
        templateUrl : "html/RafKategoriTanimlari.html"
    })
    .when("/PaletTanimlari", 
    {
        templateUrl : "html/PaletTanimlari.html"
    })
    .when("/StokTanimlari", 
    {
        templateUrl : "html/StokTanimlari.html"
    })
    .when("/PaletAdresleme", 
    {
        templateUrl : "html/PaletAdresleme.html"
    })    
    .when("/SubeEmirKapatma", 
    {
        templateUrl : "html/SubeEmirKapatma.html"
    })
    .when("/MalKabul", 
    {
        templateUrl : "html/MalKabul.html"
    })
    .when("/SiparisMalKabul", 
    {
        templateUrl : "html/SiparisMalKabul.html"
    })
    .when("/ToplamaEmriOlustur", 
    {
        templateUrl : "html/ToplamaEmriOlustur.html"
    })
    .when("/SevkiyatEmriKapama", 
    {
        templateUrl : "html/SevkiyatEmriKapama.html"
    })
    .when("/ToplamaAlaniTransfer", 
    {
        templateUrl : "html/ToplamaAlaniTransfer.html"
    })
    .when("/BosRaflar", 
    {
        templateUrl : "html/BosRaflar.html"
    })
    .when("/StokDurumRapor", 
    {
        templateUrl : "html/StokDurumRapor.html"
    })
    .when("/PersonelTanimlari", 
    {
        templateUrl : "html/PersonelTanimlari.html"
    })
});
