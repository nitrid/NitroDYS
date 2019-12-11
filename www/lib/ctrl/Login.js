function Login($scope,$window,db)
{
    $scope.server_adress = localStorage.host;
    $scope.server_port = localStorage.port;
    $scope.socket_port = localStorage.socketport;        

    $scope.Init = function()
    {
        localStorage.mode = true;
        db.Connection(function(data)
        {
            if(data == true)
            {
                $('#alert').alert('close');
            }
        });
    }
    $scope.HostSettingSave = function()
    {
        localStorage.host = $scope.server_adress;
        localStorage.port = $scope.server_port;
        localStorage.socketport = $scope.socket_port;

        db.SetHost($scope.server_adress,$scope.socket_port);
        $window.location.reload();
    }
    $scope.BtnEntry = function()
    {
        for(i = 0;i < Param.length;i++)
        {
            if(Param[i].Kullanici == $scope.Kullanici && Param[i].Sifre == $scope.Password)
            {
                console.log("Kullanıcı adı ve şifre doğru");
                
                $window.sessionStorage.setItem('Firma', $scope.Firm);
                $window.sessionStorage.setItem('User', i);
                
                var url = "main.html";
                $window.location.href = url;
                return;
            }
        }
        alertify.okBtn("Tamam");
        alertify.alert("Kullanıcı adı veya şifre yanlış");
    }
    $scope.BtnTryConnect = function()
    {
        db.SetHost($scope.server_adress,$scope.socket_port);

        if(localStorage.mode == 'true')
        {
            db.Disconnect();
        }

        db.Connection(function(data)
        {
            if(data == true)
            {
                $scope.ConnectionStatus = 'Bağlantı Başarılı.';

                if(localStorage.mode == 'false')
                {
                    db.Disconnect();
                }
            }
            else
            {
                $scope.ConnectionStatus = 'Bağlantı Başarısız.';
                db.Disconnect();
            }
            $scope.$apply();            
        });
    }
}