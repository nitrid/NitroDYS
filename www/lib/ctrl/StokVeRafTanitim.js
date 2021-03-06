function StokVeRafTanitim ($scope,$window,db)
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
    $scope.BtnGetirKey = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT STOKLAR.KODU AS KODU,STOKLAR.ADI AS ADI , BARKODLAR.KODU AS BARKOD FROM STOKLAR INNER JOIN   BARKODLAR ON STOKLAR.KODU = BARKODLAR.STOK WHERE BARKODLAR.KODU = @BARKOD ",
                param: ['BARKOD:string|25'],
                value: [$scope.StokKodu]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                if(Data.length > 0)
                {
                    $scope.StokKodu = Data[0].KODU
                }
                else
                {
                    alertify.alert("Barkod Sistemde Bulunamadı !");
                    $scope.StokKodu = ''
                }
                
            });
        }
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
            $scope.PaletKodu = $scope.PaletKodu;
            $scope.StokKodu = $scope.PaletListe[0].STOK;
            $scope.Miktar = $scope.PaletListe[0].MIKTAR;

        });
    }
    function RafGetir(pKodu)
    {
        $scope.RafListe = [];
        db.GetData($scope.Firma,'RafTanimlariGetir',[pKodu],function(Data)
        {
            if(Data.length > 0)
            {
                $scope.RafListe = Data
                $scope.RafTip = $scope.RafListe[0].TIP
                $scope.RafStok = $scope.RafListe[0].STOK
    
                
            }
            else
            {
                alertify.alert(" Raf Sistemde Bulunmuyor !!");
                $scope.RafKodu = '';
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
        $scope.PartiKodu = 0;
        $scope.StokKodu = ''
        $scope.Skt =  moment(new Date()).format("DD.MM.YYYY")
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");

        document.getElementById("page-title").innerHTML = "Toplama Alanı Transfer";
        document.getElementById("page-path").innerHTML = "Toplama Alanı Transfer";

    
        
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
           
        }
    }
    $scope.RafKoduGetir = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            RafGetir($scope.RafKodu)
            $window.document.getElementById("RafKodu").focus();
            $window.document.getElementById("RafKodu").select();
        }
    }
    $scope.Insert = function()
    {
        if($scope.PaletKodu == '')
        {
            $scope.BtnPaletGenerate()
            let InsertEtiket =
            [
                UserParam.Kullanici,
                UserParam.Kullanici,
                $scope.EtiketSeri,
                $scope.EtiketSira,
                moment(new Date()).format("DD.MM.YYYY"),
                $scope.PartiKodu,
                $scope.PaletKodu,
                $scope.StokKodu,
                $scope.EtiketBarkod,
                '',
                1,
                1,
            ];
            db.ExecuteTag($scope.Firma,'EtiketKaydet',InsertEtiket,function(Result)
            { 
                let InsertData =
                [
                    $scope.PaletKodu,
                    $scope.PartiKodu,
                    0,
                    $scope.Miktar,
                    ''
                ];
                
                db.ExecuteTag($scope.Firma,'PaletTanimlariKaydet',InsertData,function(InsertResult)
                { 
                    if(typeof(InsertResult.result.err) == 'undefined')
                    {                          
                        let InsertData =
                        [
                            UserParam.Kullanici,
                            UserParam.Kullanici,
                            $scope.PartiKodu,
                            $scope.StokKodu,
                            1,
                            $scope.Skt,
                            $scope.Miktar
                        ];
                        
                        db.ExecuteTag($scope.Firma,'PartiInsert',InsertData,function(InsertResult)
                        { 
                            if(typeof(InsertResult.result.err) == 'undefined')
                            {            
                                    if(typeof(InsertResult.result.err) == 'undefined')
                                    {            
                                        let InsertData =
                                        [
                                            UserParam.Kullanici,
                                            UserParam.Kullanici,
                                            0,
                                            $scope.RafTip,
                                            $scope.Tarih,
                                            '',
                                            0,
                                            $scope.StokKodu,
                                            $scope.PaletKodu,
                                            $scope.RafKodu,
                                            $scope.RafKodu,
                                            1,
                                            $scope.Miktar,
                                            '',
                                            '',
                                            '',
                                        ];
                                        db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
                                        { 
                                            if(typeof(InsertResult.result.err) == 'undefined')
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
                                                        db.ExecuteTag($scope.Firma,'PaletRafıUpdate',[$scope.RafKodu,$scope.PaletKodu],function(InsertResult)
                                                        { 
                                                            console.log(InsertResult)
                                                        });
                                                        InsertAfterRefresh();
                                                        pCallback(true);
                                                    });
                                            }
                                        });
                                    }
                            }
                        });   
                    }
                });   
               
            });

        }
        else
        {
            let InsertData =
            [
                UserParam.Kullanici,
                UserParam.Kullanici,
                0,
                $scope.RafTip,
                $scope.Tarih,
                '',
                0,
                $scope.StokKodu,
                $scope.PaletKodu,
                $scope.RafKodu,
                $scope.RafKodu,
                1,
                $scope.Miktar,
                '',
                '',
                '',
            ];
            db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
            { 
                if(typeof(InsertResult.result.err) == 'undefined')
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
                            db.ExecuteTag($scope.Firma,'PaletRafıUpdate',[$scope.RafKodu,$scope.PaletKodu],function(InsertResult)
                            { 
                                console.log(InsertResult)
                            });
                            InsertAfterRefresh();
                            pCallback(true);
                        });
                }
            });
        
        }
        
    }
    $scope.BtnPaletGenerate = function()
    {        
        let KulStr = "";
        let TarihStr = "";
        let AutoStr = "";

        UserParam.Sistem.PaletFormat.toString().split("|").forEach(function(item)
        {
            if(item.toString().indexOf("K") > -1)
            {
                KulStr = $scope.DataListe[0].KODU.toString().substring(0,item.toString().length);
            }
            else if(item.toString().indexOf("YYYYMMDD") > -1)
            {
                TarihStr = moment(new Date()).format("YYYYMMDD");
            }
            else if(item.toString().indexOf("YYMMDD") > -1)
            {
                TarihStr = moment(new Date()).format("YYMMDD");
            }
            else if(item.toString().indexOf("O") > -1)
            {
                let length = item.toString().length;
                let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'.split('');
                
                if (! length) 
                {
                    length = Math.floor(Math.random() * chars.length);
                }
                
                for (let i = 0; i < length; i++) 
                {
                    AutoStr += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            else if(item.toString().indexOf("N") > -1)
            {
                let length = item.toString().length;
                let chars = '0123456789'.split('');
                
                if (! length) 
                {
                    length = Math.floor(Math.random() * chars.length);
                }
                
                for (let i = 0; i < length; i++) 
                {
                    AutoStr += chars[Math.floor(Math.random() * chars.length)];
                }
            }
        });

        $scope.PaletKodu = KulStr + TarihStr + AutoStr;
        $scope.BtnPartiGenerate()
    }
    $scope.BtnPartiGenerate = function()
    {        
        let KulStr = "";
        let TarihStr = "";
        let AutoStr = "";

        UserParam.Sistem.PartiFormat.toString().split("|").forEach(function(item)
        {
            if(item.toString().indexOf("K") > -1)
            {
                KulStr = $scope.PartiKodu.toString().substring(0,item.toString().length);
            }
            else if(item.toString().indexOf("YYYYMMDD") > -1)
            {
                TarihStr = moment(new Date()).format("YYYYMMDD");
            }
            else if(item.toString().indexOf("YYMMDD") > -1)
            {
                TarihStr = moment(new Date()).format("YYMMDD");
            }
            else if(item.toString().indexOf("O") > -1)
            {
                let length = item.toString().length;
                let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'.split('');
                
                if (! length) 
                {
                    length = Math.floor(Math.random() * chars.length);
                }
                
                for (let i = 0; i < length; i++) 
                {
                    AutoStr += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            else if(item.toString().indexOf("N") > -1)
            {
                let length = item.toString().length;
                let chars = '0123456789'.split('');
                
                if (! length) 
                {
                    length = Math.floor(Math.random() * chars.length);
                }
                
                for (let i = 0; i < length; i++) 
                {
                    AutoStr += chars[Math.floor(Math.random() * chars.length)];
                }
            }
        });

        $scope.PartiKodu = KulStr + TarihStr + AutoStr;
    }

}