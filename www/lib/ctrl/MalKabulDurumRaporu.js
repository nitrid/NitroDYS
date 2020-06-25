function MalKabulDurumRaporu($scope,$window,db)
{
    function MalKabulDurum()
    {   
        $("#TblMalKabulDurum").jsGrid
        ({
            width: "100%",
            height: "auto",
            updateOnResize: true,
            heading: true,
            selecting: true,
            sorting: true,
            paging: true,
            data : $scope.MalkabulRaporListe,
            fields: 
            [
                {
                    name: "SERI",
                    title: "SERI",
                    type: "text",
                    align: "center",
                    width: 120
                    
                },
                {
                    name: "SIRA",
                    title: "SIRA",
                    type: "text",
                    align: "center",
                    width: 120
                },
                {
                    name: "CARI",
                    title: "CARI",
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

        document.getElementById("page-title").innerHTML = "Mal Kabul Durum Raporu";
        document.getElementById("page-path").innerHTML = "Mal Kabul Durum Raporu";

        MalKabulDurum();
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
            query:  "SELECT SERI AS SERI,SIRA AS SIRA, CIKIS AS CARI, SUM(MIKTAR) AS MIKTAR,SUM(TESLIM_MIKTAR) AS TESLIM,((SUM(TESLIM_MIKTAR) * SUM(MIKTAR)) / 100 ) AS YUZDE FROM EMIRLER " +
            " WHERE  TIP = 0 AND CINS = 3 AND DURUM = @DURUM GROUP BY SERI,SIRA,CIKIS,TIP,CINS",
            param:  ['DURUM'], 
            type:   ['int'], 
            value:  [$scope.RaporTip]    
        }
    
        db.GetDataQuery(TmpQuery,function(Data)
        {
            $scope.MalkabulRaporListe = Data
            $("#TblMalKabulDurum").jsGrid({data : $scope.MalkabulRaporListe});
        });
    }
}