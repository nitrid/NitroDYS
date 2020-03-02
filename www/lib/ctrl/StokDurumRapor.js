function StokDurumRapor($scope,$window,db)
{
    let SecimSelectedRow = null;

    function TblSecimInit(pData)
    {
        
        let TmpColumns = []
           
        if(pData.length > 0)
        {
            Object.keys(pData[0]).forEach(function(item)
            {
                TmpColumns.push({name : item,type: "text"});
            });    
        }
        
        let db = {
            loadData: function(filter) 
            {
                return $.grep(pData, function(client) 
                { 
                    return (!filter.KODU || client.KODU.indexOf(filter.KODU) > -1)
                        && (!filter.ADI || client.ADI.indexOf(filter.ADI) > -1)
                });
            }
        };
        
        $("#TblSecim").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : pData,
            paging : true,
            filtering : true,
            pageSize: 10,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: TmpColumns,
            rowClick: function(args)
            {
                SecimListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            },
            controller:db,
        });
        $("#TblSecim").jsGrid("search");
    }
    function SecimListeRowClick(pIndex,pItem,pObj)
    {    
        if ( SecimSelectedRow ) { SecimSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        SecimSelectedRow = $row;
        SecimSelectedRow.Item = pItem
        SecimSelectedRow.Index = pIndex
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.CmbEvrakTip = "0"
        $scope.ToplamaRafı = ""
        $scope.TMiktar = ""
        $scope.SMiktar = ""
        $scope.Toplam = ""

        $scope.EvrakTipChange();
    }
    $scope.BtnSecimGrid = function()
    {
        
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT KODU,ADI FROM STOKLAR"
        } 
        db.GetDataQuery(TmpQuery,function(Data)
        {
            TblSecimInit(Data);
            $('#MdlSecim').modal('show');
        
        });
    }
    $scope.BtnGridSec = function()
    {
        console.log(1)
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT KODU,ADI,ISNULL((SELECT TOP 1 KODU FROM BARKODLAR WHERE STOK = STOKLAR.KODU),KODU) AS BARKOD FROM STOKLAR WHERE KODU = @KODU",
            param: ['KODU:string|25'],
            value: [SecimSelectedRow.Item.KODU]
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            console.log(Data)
            $scope.StokListe = Data
            $scope.Barkod =  $scope.StokListe[0].BARKOD
            $scope.StokAdi = $scope.StokListe[0].ADI
            $scope.StokKodu =  $scope.StokListe[0].KODU
            $("#MdlSecim").modal('hide');
        });
    }
    $scope.BtnGetirKey = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            console.log(1)
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,ADI,ISNULL((SELECT TOP 1 KODU FROM BARKODLAR WHERE STOK = STOKLAR.KODU),KODU) AS BARKOD FROM STOKLAR WHERE (SELECT TOP 1 KODU FROM BARKODLAR WHERE STOK = STOKLAR.KODU) = @BARKOD",
                param: ['BARKOD:string|25'],
                value: [$scope.Barkod]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                console.log(Data)
                $scope.StokListe = Data
                $scope.Barkod =  $scope.StokListe[0].BARKOD
                $scope.StokAdi = $scope.StokListe[0].ADI
                $scope.StokKodu =  $scope.StokListe[0].KODU
            });
        }
    }
    $scope.EvrakTipChange= function()
    {
        if($scope.CmbEvrakTip == 0)
        {
            $scope.KategoriTip = '001'
        }
        else if($scope.CmbEvrakTip == 1)
        {
            $scope.KategoriTip = '002'
        }
        else if($scope.CmbEvrakTip == 2)
        {
            $scope.KategoriTip = '003'
        }
    }
    $scope.BtnGetir = function()
    {
        console.log($scope.StokKodu)
        var TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT *,(SELECT SUM(MIKTAR) FROM STOK_HAREKET_VIEW_01 WHERE STOK = STOKLAR.KODU) AS TOPLAMAMIKTAR ,"+
            "(SELECT SUM(MIKTAR) FROM PALET_HAREKET_VIEW_01 WHERE STOK = STOKLAR.KODU) AS SAKLAMAMIKTAR" +
            " , dbo.FnToplamaAlaniStokRafi(KODU) AS RAFI FROM STOKLAR WHERE KODU = @KODU ",
            param:  ['KODU'], 
            type:   ['string|25'], 
            value:  [$scope.StokKodu]    
        }
    
        db.GetDataQuery(TmpQuery,function(Data)
        {
           $scope.ToplamaRafi = Data[0].RAFI
           $scope.TMiktar = Data[0].TOPLAMAMIKTAR
           $scope.SMiktar = Data[0].SAKLAMAMIKTAR
           $scope.Toplam = $scope.TMiktar + $scope.SMiktar
        });
    }
}