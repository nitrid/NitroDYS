function ToplamaAlaniTransfer ($scope,$window,db)
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
                        && (!filter.STOK || client.STOK.indexOf(filter.STOK) > -1)
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
            pageSize: 5,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: TmpColumns,
            rowClick: function(args)
            {
                SecimListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            },
            controller:db
        });
        $("#TblSecim").jsGrid("search");
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

    function AdresGetir()
    {
        $scope.TopAdresListe = [];

        TmpQuery = 
        {
            db : $scope.Firma,
            query : "SELECT TOP(10) PARTI AS PALET, GIRIS AS RAF, " +
                    " CASE  WHEN TIP = 0 THEN 'GİRİŞ' " +
                    " WHEN TIP = 1 THEN 'ÇIKIŞ' END AS TIP, MIKTAR AS MIKTAR  from EMIR_HAREKETLERI WHERE MIKTAR > @MIKTAR AND CINS = 1 ORDER BY OTARIH DESC" ,
            param : ['MIKTAR:float'],
            value : [0]
        } 
        db.GetDataQuery(TmpQuery,function(Data)
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
            console.log(Data)
            $scope.PaletListe = Data;
            $scope.PaletKodu = $scope.PaletListe[0].KODU;
            $scope.Stok = $scope.PaletListe[0].STOK;
            $scope.Miktar = $scope.PaletListe[0].MIKTAR
        });
    }
    function RafGetir(pKodu)
    {
        $scope.RafListe = [];
        db.GetData($scope.Firma,'RafTanimlariGetir',[pKodu],function(Data)
        {
            $scope.RafListe = Data
            $scope.RafTip = $scope.RafListe[0].TIP
            $scope.RafStok = $scope.RafListe[0].STOK

            if($scope.RafTip == 0)
            {
                $scope.CmbEvrakTip = 1
            }
            else
            {
                $scope.CmbEvrakTip = 0
            }
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
        $scope.Miktar = 0;
        $scope.PaletKodu = '';
        $scope.RafKodu = '';
        $scope.RafMiktar = 0;
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");

        document.getElementById("page-title").innerHTML = "Palet Adresleme";
        document.getElementById("page-path").innerHTML = "Palet Adresleme";

    
        
        TblArdesGrid();
        AdresGetir();

        $scope.AdresSeri = ''
    }
    $scope.BtnGridSec = function()
    {
        if(ModalTip == "Palet")
        {
            $scope.PaletKodu = SecimSelectedRow.Item.KODU;
            PaletGetir($scope.PaletKodu)
            $("#MdlSecim").modal('hide');
        }
        if(ModalTip == "Raf")
        {
            $scope.RafKodu = SecimSelectedRow.Item.KODU
            RafGetir($scope.RafKodu)

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
                query:  "SELECT KODU,STOK,SKT FROM PARTILER"
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
        else if(ModalTip == "Raf")
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
    $scope.RafKoduGetir = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            RafGetir($scope.RafKodu)
        }
    }
    $scope.Insert = function()
    {console.log(1)
        if($scope.RafTip == 0 && $scope.CmbEvrakTip == 0)
        {
            alertify.alert("Seçtiğini Raf Toplama Rafıdır... Kayıt Yapılmadı!!");
        }
        else
        {   
            if($scope.Miktar < 1)
            {
                alertify.alert("Palet Kodunuz Hatalı veya Palet Boş..");
                InsertAfterRefresh();
            }
            else
            {
                let InsertData =
                [
                    UserParam.Kullanici,
                    UserParam.Kullanici,
                    $scope.CmbEvrakTip,
                    1,
                    $scope.Tarih,
                    '',
                    0,
                    $scope.Stok,
                    $scope.PaletKodu,
                    $scope.RafKodu,
                    $scope.RafKodu,
                    1,
                    $scope.Miktar,
                    '',
                    '',
                ];
                
                db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
                { 
                    if(typeof(InsertResult.result.err) == 'undefined')
                    {                          
                        if($scope.CmbEvrakTip == 0)
                        {
                                let TmpQuery = 
                                {
                                    db : $scope.Firma,
                                    query:  "UPDATE RAFLAR SET MIKTAR = MIKTAR + @MIKTAR WHERE KODU = @KODU",
                                    param : ['MIKTAR','KODU'],
                                    type : ['float','string|50'],
                                    value : [$scope.Miktar,$scope.RafKodu]
                                }
                                db.GetDataQuery(TmpQuery,function(Data)
                                {
                                    console.log('CREATED BY RECEP KARACA ;)')   
                                    db.ExecuteTag($scope.Firma,'PaletRafıUpdate',[$scope.RafKodu,$scope.PaletKodu],function(InsertResult)
                                    { 
                                        console.log(InsertResult)
                                    });
                                    InsertAfterRefresh();
                                });

                                
                          
                        }
                        else
                        {
                            let TmpQuery = 
                            {
                                db : $scope.Firma,
                                query:  "UPDATE RAFLAR SET MIKTAR = (MIKTAR - @MIKTAR) WHERE KODU = @KODU",
                                param : ['MIKTAR','KODU'],
                                type : ['float','string|25'],
                                value : [$scope.Miktar,$scope.RafKodu]
                            }
                            db.GetDataQuery(TmpQuery,function(Data)
                            {
                                InsertAfterRefresh();
                            });
                        }
                    }
                });   
            }    
        }
    }

}