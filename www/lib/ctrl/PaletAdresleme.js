function PaletAdresleme ($scope,$window,db)
{
    let SecimSelectedRow = null;
    function TblSecimInit(pData)
    {
        
        let TmpColumns = []
           
        if(pData.length > 0)
        {
            Object.keys(pData[0]).forEach(function(item)
            {
                TmpColumns.push({name : item});
            });    
        }
        
        $("#TblSecim").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : pData,
            paging : true,
            pageSize: 5,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: TmpColumns,
            rowClick: function(args)
            {
                SecimListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }
        });
    }
    function TblArdesGrid(pData)
    {                
        $("#TblAdres").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : pData,
            paging : true,
            pageSize: 5,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: 
            [
                {
                    name: "PALET",
                    title: "PALET",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "RAF",
                    title: "RAF",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "TIP",
                    title: "TIP",
                    type: "text",
                    align: "center",
                    width: 200
                },
                {
                    name: "MIKTAR",
                    title: "MIKTAR",
                    type: "text",
                    align: "center",
                    width: 100
                }
            ],
            rowClick: function(args)
            {
                AdresListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }
        });
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
    function AdresListeRowClick(pIndex,pItem,pObj)
    {    
        if ( AdresSelectedRow ) { AdresSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        AdresSelectedRow = $row;
        AdresSelectedRow.Item = pItem
        AdresSelectedRow.Index = pIndex
    }
    function AdresGetir()
    {
        $scope.TopAdresListe = [];
        db.GetData($scope.Firma,'TopAdresGetir','0',function(Data)
        {
            $scope.TopAdresListe = Data;
            TblArdesGrid(Data);

        });
    }
    function PaletGetir(pKodu)
    {
        $scope.PaletListe = [];
        db.GetData($scope.Firma,'PaletTanimlariGetir',[pKodu],function(Data)
        {
            $scope.PaletListe = Data;
            $scope.PaletKodu = $scope.PaletListe[0].KODU;
            $scope.MIKTAR = $scope.PaletListe[0].MIKTAR
        });
    }
    function RafGetir(pKodu)
    {
        $scope.RafListe = [];
        db.GetData($scope.Firma,'RafTanimGetir',[pKodu],function(Data)
        {
            $scope.RafListe = Data;
            $scope.RafKodu = $scope.RafListe[0].KODU;
        });  
    }
    function InsertAfterRefresh()
    {
        $scope.PaletKodu = '';
        $scope.RafKodu = '';
        $scope.Init()


    }
    $scope.Init = function()
    {
        $scope.Seri = ''
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.CmbEvrakTip = '0';
        $scope.MIKTAR = 0;
        $scope.PaletKodu = '';
    
        
        TblArdesGrid();
        AdresGetir();

        $scope.AdresSeri = ''
    }
    $scope.BtnGridSec = function()
    {
        if(ModalTip == "Palet")
        {
            PaletGetir(SecimSelectedRow.Item.KODU);
            $("#MdlSecim").modal('hide');
        }
        if(ModalTip == "RAF")
        {
            RafGetir(SecimSelectedRow.Item.KODU);
            $("#MdlSecim").modal('hide');
        }
        ModalTip = "";
    }
    $scope.BtnSecimGrid = function(pTip)
    {
        ModalTip = pTip;

        if(ModalTip == "Palet")
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,STOK,SKT FROM PALETLER"
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
        else if(ModalTip == "RAF")
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,KAT,SIRA FROM RAFLAR"
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
    }
    $scope.PaletKoduGetir = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            PaletGetir($scope.PaletKodu)
            $window.document.getElementById("RafKodu").focus();
            $window.document.getElementById("RafKodu").select();
        }
    }
    $scope.Insert = function()
    {
        console.log($scope.MIKTAR)
        if($scope.MIKTAR < 1)
        {
            alertify.alert("Palet Kodunuz Hatalı veya Palet Boş..");
            InsertAfterRefresh();
        }
        else
        {
            let InsertData =
            [
                UserParam.Kullanici,
                $scope.RafKodu,
                $scope.CmbEvrakTip,
                $scope.PaletListe[0].KODU,
                $scope.MIKTAR,
            ];
            
            db.ExecuteTag($scope.Firma,'PaletHarInsert',InsertData,function(InsertResult)
            { 
                if(typeof(InsertResult.result.err) == 'undefined')
                {                          
                  console.log('CREATED BY RECEP KARACA ;)')   
                }
                AdresGetir();
                InsertAfterRefresh();
            });   
        }
        
    }

}