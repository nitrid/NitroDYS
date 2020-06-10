function BosRaflar($scope,$window,db)
{
    function InıtBosRaflarRapor()
    {   
        $("#TblBosRaflar").jsGrid
        ({
            width: "100%",
            height: "auto",
            updateOnResize: true,
            heading: true,
            selecting: true,
            sorting: true,
            paging: true,
            data : $scope.TahsilatRapor,
            fields: 
            [
                {
                    name: "KODU",
                    title: "RAF",
                    type: "text",
                    align: "center",
                    width: 120
                    
                },
                {
                    name: "KATEGORIADI",
                    title: "KATEGORI ADI",
                    type: "text",
                    align: "center",
                    width: 120
                },
                {
                    name: "MIKTAR",
                    title: "MIKTAR",
                    type: "text",
                    align: "center",
                    width: 120
                },

            ],
        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.CmbEvrakTip = "0"

        document.getElementById("page-title").innerHTML = "Boş Raflar Raporu";
        document.getElementById("page-path").innerHTML = "Boş Raflar Raporu";

        InıtBosRaflarRapor();
        $scope.EvrakTipChange();
    }
    $scope.EvrakTipChange= function()
    {
        if($scope.CmbEvrakTip == 0)
        {
            $scope.KategoriTip = '01'
        }
        else if($scope.CmbEvrakTip == 1)
        {
            $scope.KategoriTip = '02'
        }
        else if($scope.CmbEvrakTip == 2)
        {
            $scope.KategoriTip = '03'
        }
    }
    $scope.BtnGetir = function()
    {
        console.log($scope.KategoriTip)
        var TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT *,(SELECT ADI FROM RAF_KATEGORI WHERE KODU = KATEGORI) AS KATEGORIADI FROM RAFLAR WHERE MIKTAR <= 10 AND KATEGORI = @KATEGORI ",
            param:  ['KATEGORI'], 
            type:   ['string|25'], 
            value:  [$scope.KategoriTip]    
        }
    
        db.GetDataQuery(TmpQuery,function(Data)
        {
            console.log(Data)
            $scope.RafListe = Data;
            $("#TblBosRaflar").jsGrid({data : $scope.RafListe});
        });
    }
}