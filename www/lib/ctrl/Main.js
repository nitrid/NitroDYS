function Main ($scope,$rootScope,$window,db)
{
    $rootScope.LoadingShow = function() 
    {
        $("#loading").show();
    }
    $rootScope.LoadingHide = function() 
    {
        $("#loading").hide();
    }
    $rootScope.MessageBox = function(pMsg)
    {
        alertify.alert(pMsg);
    }
    $scope.Init = function()
    {
        $scope.Firma = $window.sessionStorage.getItem('Firma');
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
    
        document.getElementById("page-title").innerHTML = "Anasayfa";

        db.Connection(function(){});
    }
}