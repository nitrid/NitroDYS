function SevkiyatDurumRaporu($scope,$window,db)
{
    function SevkiyatDurum()
    {   
        $("#TblSevkiyatDurum").jsGrid
        ({
            width: "100%",
            height: "auto",
            updateOnResize: true,
            heading: true,
            selecting: true,
            sorting: true,
            paging: true,
            data : $scope.SevkiyatRaporListe,
            fields: 
            [
                {
                    name: "EMIRNO",
                    title: "EMIRNO",
                    type: "text",
                    align: "center",
                    width: 120
                    
                },
                {
                    name: "TASIYICI",
                    title: "TASIYICI",
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
                {
                    name: "YUZDE",
                    title: "YUZDE",
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
        $scope.RaporTip = 0

        document.getElementById("page-title").innerHTML = "Sevkiyat Durum Raporu";
        document.getElementById("page-path").innerHTML = "Sevkiyat Durum Raporu";

        SevkiyatDurum();
        $scope.EvrakTipChange();
    }
    $scope.EvrakTipChange= function()
    {
        if($scope.CmbEvrakTip == 0)
        {
            $scope.RaporTip = 0
        }
        else if($scope.CmbEvrakTip == 1)
        {
            $scope.RaporTip = 1
        }
        else if($scope.CmbEvrakTip == 2)
        {
            $scope.RaporTip = 2
        }
    }
    $scope.BtnGetir = function()
    {
        var TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT EMIRNO AS EMIRNO, TASIYICI AS TASIYICI, SUM(MIKTAR) AS MIKTAR,SUM(TESLIM_MIKTAR) AS TESLIM,((SUM(TESLIM_MIKTAR) * SUM(MIKTAR)) / 100 ) AS YUZDE FROM EMIRLER " +
            " WHERE  TIP = 1 AND CINS = 3 AND DURUM = @DURUM AND EMIRNO > 0 GROUP BY EMIRNO,TASIYICI,TIP,CINS",
            param:  ['DURUM'], 
            type:   ['int'], 
            value:  [$scope.RaporTip]    
        }
    
        db.GetDataQuery(TmpQuery,function(Data)
        {
            $scope.SevkiyatRaporListe = Data
            $("#TblSevkiyatDurum").jsGrid({data : $scope.SevkiyatRaporListe});
        });
    }
}