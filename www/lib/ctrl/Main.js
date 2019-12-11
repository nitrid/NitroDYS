function Main ($scope,$window,db)
{
    $scope.Init = function()
    {
        $scope.Firma = $window.sessionStorage.getItem('Firma');
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
    
        document.getElementById("page-title").innerHTML = "Anasayfa";

        db.Connection(function(){});
    }
}