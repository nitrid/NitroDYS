function SubeEmirKapatma ($scope,$window,db)
{
    let SiparisSelectedRow = null;
    
    function TblSiparisSecimGrid(pData)
    {                
        $("#TblSipSecim").jsGrid
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
                    name: "SERI",
                    title: "SERI",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "SIRA",
                    title: "SIRA",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "SUBE",
                    title: "SUBE",
                    type: "text",
                    align: "center",
                    width: 150
                },
            ],
            rowClick: function(args)
            {
                SiparisListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }

        });
    }
    function SipListeGrid(pData)
    {                
        $("#TblListe").jsGrid
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
                    name: "KODU",
                    title: "KODU",
                    type: "text",
                    align: "center",
                    width: 125
                },
                {
                    name: "ADI",
                    title: "ADI",
                    type: "text",
                    align: "center",
                    width: 125
                },
                {
                    name: "MIKTAR",
                    title: "MIKTAR",
                    type: "text",
                    align: "center",
                    width: 75
                },
                {
                    name: "TESLIM",
                    title: "TESLIM",
                    type: "text",
                    align: "center",
                    width: 75
                },
            ],

        });
    }
    function SiparisListele()
    {
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT SERI AS SERI,SIRA AS SIRA,CIKIS AS SUBE,TIP,CINS FROM EMIRLER WHERE TIP = 1 AND CINS = 1 AND KAPALI <> 1 AND MIKTAR > TESLIM_MIKTAR AND TARIH>=@ILKTARIH AND TARIH<=@SONTARIH GROUP BY SERI,SIRA,CIKIS,TIP,CINS",
                param: ['ILKTARIH','SONTARIH'],
                type: ['date','date'],
                value:[$scope.SipTarih,$scope.SipTarih2]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSiparisSecimGrid(Data);
                $('#MdlSecim').modal('show');
            });
        }
    }
    function SiparisListeRowClick(pIndex,pItem,pObj)
    {    
        if ( SiparisSelectedRow ) { SiparisSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        SiparisSelectedRow = $row;
        SiparisSelectedRow.Item = pItem
        SiparisSelectedRow.Index = pIndex
        $scope.SipSeri = SiparisSelectedRow.Item.SERI;
        $scope.SipSira = SiparisSelectedRow.Item.SIRA;
    }
    function StokBarkodGetir(pBarkod)
    {
        if($scope.PaletGonder == false)
        {
            db.StokBarkodGetir($scope.Firma,pBarkod,$scope.CDepo,async function(BarkodData)
            {  
                if(BarkodData.length > 0)
                { 
                    $scope.BarkodData = BarkodData
                    if($scope.SipStokKodu == $scope.BarkodData[0].STOK)
                    {
                        console.log($scope.BarkodData)
                        $scope.StokAdi = $scope.BarkodData[0].STOKADI 
                        $scope.Stokkodu = $scope.BarkodData[0].STOK
                        $scope.Miktar = 1;
                       
                        $window.document.getElementById("Miktar").focus();
                        $window.document.getElementById("Miktar").select();
                    }
                    else
                    {
                        alertify.alert("<a style='color:#3e8ef7''>" + "Yanlış Stok Okuttunuz." + "</a>" );                 
                        console.log(" Yanlış Stok Okuttunuz.");
                    }
                }
                else
                {
                    alertify.alert("<a style='color:#3e8ef7''>" + "Stok Bulunamamıştır !" + "</a>" );          
                    console.log("Stok Bulunamamıştır.");
                }
            });
        }
        else
        {
            db.GetData($scope.Firma,'PaletTanimlariGetir',[pBarkod],function(Data)
            {
                $scope.PaletListe = Data;
                if($scope.PaletListe[0].MIKTAR >= 1)
                {
                    $scope.PaletKodu = $scope.PaletListe[0].KODU;
                    $scope.Miktar = $scope.PaletListe[0].MIKTAR;
                    $scope.PaletStok = $scope.PaletListe[0].STOK;
                    if($scope.SipStokKodu =! $scope.PaletStok)
                    {
                        alertify.alert("<a style='color:#3e8ef7''>" + "Okuttuğunuz Palet Siparişteki Stoğunuzla Eşleşmedi !" + "</a>" );          
                        console.log("Stok Bulunamamıştır.");
                    }
                }
                else
                {
                    alertify.alert("<a style='color:#3e8ef7''>" + "Paletiniz Boş !" + "</a>" );          
                    console.log("Stok Bulunamamıştır.");
                }
            });
        }

    }
    function Insert()
    {
        if($scope.PaletGonder == false)
        {
            let InsertData = 
            [
                UserParam.Kullanici,
                1,
                1,
                $scope.Seri,
                $scope.Sira,
                $scope.Stokkodu,
                $scope.GirisSube,
                $scope.Raf,
                $scope.Birim,
                $scope.Miktar,
                '',
                $scope.SipStokUid
            ]
            db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
            { 
                if(typeof(InsertResult.result.err) == 'undefined')
                {                          
                    let TmpQuery = 
                    {
                        db : $scope.Firma,
                        query:  "UPDATE EMIRLER SET TESLIM_MIKTAR = (TESLIM_MIKTAR + @TESLIM) WHERE UID = @UID",
                        param : ['TESLIM','UID'],
                        type : ['int','string|50'],
                        value : [$scope.Miktar,$scope.SipStokUid]
                    }
                    db.GetDataQuery(TmpQuery,function(Data)
                    {
                        let TmpQuery = 
                        {
                            db : $scope.Firma,
                            query:  "UPDATE RAFLAR SET MIKTAR = MIKTAR - @MIKTAR WHERE KODU = @KODU",
                            param : ['MIKTAR','KODU'],
                            type : ['float','string|50'],
                            value : [$scope.Miktar,$scope.Raf]
                        }
                        db.GetDataQuery(TmpQuery,function(Data)
                        {
                            InsertAfterRefesh()
                            console.log('R')
                        });
                    });
                }
            });  
        }
        else
        {
            let InsertData1 = 
            [
                UserParam.Kullanici,
                1,
                0,
                'PG',
                1,
                $scope.PaletKodu,
                $scope.PaletRafKodu,
                $scope.PaletRafKodu,
                1,
                $scope.Miktar,
                '',
                '',
            ]
            db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData1,function(InsertResult)
            { 
                let TmpQuery1 = 
                {
                    db : $scope.Firma,
                    query:  "UPDATE RAFLAR SET MIKTAR = MIKTAR - @MIKTAR WHERE KODU = @KODU",
                    param : ['MIKTAR','KODU'],
                    type : ['float','string|50'],
                    value : [$scope.Miktar,$scope.PaletRafKodu]
                }
                db.GetDataQuery(TmpQuery1,function(Data)
                {
                    console.log('Radftan Eksildi)')   
                });

                let Data1 =
                [
                    $scope.Miktar,
                    $scope.PaletKodu,
                ];
                console.log(Data1)
                db.ExecuteTag($scope.Firma,'PaletEksiltme',Data1,function(InsertResult)
                { 
                    if(typeof(InsertResult.result.err) == 'undefined')
                    {  
                        let InsertData = 
                        [
                            UserParam.Kullanici,
                            1,
                            1,
                            $scope.Seri,
                            $scope.Sira,
                            $scope.Stokkodu,
                            $scope.GirisSube,
                            $scope.Raf,
                            $scope.Birim,
                            $scope.Miktar,
                            '',
                            $scope.SipStokUid
                        ]
                        db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
                        { 
                            if(typeof(InsertResult.result.err) == 'undefined')
                            {                          
                                let TmpQuery = 
                                {
                                    db : $scope.Firma,
                                    query:  "UPDATE EMIRLER SET TESLIM_MIKTAR = (TESLIM_MIKTAR + @TESLIM) WHERE UID = @UID",
                                    param : ['TESLIM','UID'],
                                    type : ['int','string|50'],
                                    value : [$scope.Miktar,$scope.SipStokUid]
                                }
                                db.GetDataQuery(TmpQuery,function(Data)
                                {
                                    let TmpQuery = 
                                    {
                                        db : $scope.Firma,
                                        query:  "UPDATE RAFLAR SET MIKTAR = MIKTAR - @MIKTAR WHERE KODU = @KODU",
                                        param : ['MIKTAR','KODU'],
                                        type : ['float','string|50'],
                                        value : [$scope.Miktar,$scope.Raf]
                                    }
                                    db.GetDataQuery(TmpQuery,function(Data)
                                    {
                                        InsertAfterRefesh()
                                        console.log('R')
                                    });
                                });
                            }
                        });  
                    }
                });             
            });   

            let InsertData2 =
            [
                UserParam.Kullanici,
                0,
                0,
                'PG',
                0,
                $scope.PaletKodu,
                $scope.Raf,
                $scope.Raf,
                1,
                $scope.Miktar,
                '',
                '',
            ];
            db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData2,function(InsertResult)
            { 
                if(typeof(InsertResult.result.err) == 'undefined')
                {                          
                    let TmpQuery2 = 
                    {
                        db : $scope.Firma,
                        query:  "UPDATE RAFLAR SET MIKTAR = MIKTAR + @MIKTAR WHERE KODU = @KODU",
                        param : ['MIKTAR','KODU'],
                        type : ['float','string|50'],
                        value : [$scope.Miktar,$scope.Raf]
                    }
                    db.GetDataQuery(TmpQuery2,function(Data)
                    {
                        console.log('CREATED BY RECEP KARACA ;)')   
                    });
                }
            }); 
        }
    }
    InsertAfterRefesh = function()
    {
        $scope.Barkod = ''
        $scope.Miktar = 1
        $scope.StokAdi = ''
        $scope.BekleyenMiktar = ''
        $scope.Urun = ''
        $scope.Raf = ''
        $scope.Kat = ''
        $scope.Sube = ''
        $scope.SipStokUid = ''
        $scope.SipStokKodu = ''
        $scope.GirisSube = ''
        $scope.Birim = ''
        $scope.BirimAdi = ''
        $scope.Katsayi = ''
        $scope.BtnSipSec()
        $scope.PaletGonder = false;
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.Seri = 'B'
        $scope.Urun = ''
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");
        $scope.SipTarih =   new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.SipTarih2 =  new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.PaletGonder = false;
        $scope.RafLock = true;
        $scope.MainClick();
        db.MaxSira($scope.Firma,'EmirlerMaxSira',[$scope.Seri,1,1],function(data)
        {
            $scope.Sira = data
            console.log(data)
        });


        SiparisListele()
        TblSiparisSecimGrid()
    }
    $scope.MainClick = function() 
    {
        $("#TbSiparisSecim").addClass('active');
        $("#TbSiparisGiris").removeClass('active');
    }
    $scope.BtnSipListele = function()
    {
        SiparisListele()
    }
    $scope.BtnSipSec = function()
    {

        db.GetData($scope.Firma,'SubeEmriGetir',[$scope.SipSeri,$scope.SipSira,1,1],function(data)
        {
            $scope.SiparisStok = data;
            if($scope.SiparisStok == '')
            {
                alertify.alert("<a style='color:#3e8ef7''>" + "Şube Emir Kapanmıştır !" + "</a>" );          
                console.log("Stok Bulunamamıştır.");
                $scope.SipListesi();
            }
            else
            {
                console.log($scope.SiparisStok)
                $scope.Urun = $scope.SiparisStok[0].STOKADI;
                $scope.Raf = $scope.SiparisStok[0].RAFKODU;
                $scope.Kat = $scope.SiparisStok[0].RAFKATI;
                $scope.Sube = $scope.SiparisStok[0].SUBEADI;
                $scope.SipStokUid = $scope.SiparisStok[0].EMIRUID;
                $scope.SipStokKodu = $scope.SiparisStok[0].STOKKOD;
                $scope.GirisSube = $scope.SiparisStok[0].GIRIS
                $scope.Birim = $scope.SiparisStok[0].BIRIM
                $scope.BirimAdi = $scope.SiparisStok[0].BIRIMADI
                $scope.Katsayi = $scope.SiparisStok[0].KATSAYI
                $scope.RafLock = true;

                let TmpQuery = 
                {
                    db : $scope.Firma,
                    query:  "SELECT (MIKTAR - TESLIM_MIKTAR) AS BEKLEYEN FROM EMIRLER WHERE UID = @UID",
                    param: ['UID'],
                    type: ['string|50'],
                    value:[$scope.SipStokUid]
                }
                db.GetDataQuery(TmpQuery,function(Data)
                {
                    $scope.BekleyenMiktar = Data[0].BEKLEYEN 
                });

                $scope.SipListesi();
    
                $("#TbSiparisGiris").addClass('active');
                $("#TbSiparisSecim").removeClass('active');
            }

        });
    }
    $scope.BtnStokBarkodGetir = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            StokBarkodGetir($scope.Barkod);    
        }
    }
    $scope.BtnEkleKey = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            $scope.BtnEkle()
        }
    }
    $scope.BtnEkle = function()
    {
            Insert()   
    }
    $scope.Kapat = function()
    {
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "UPDATE EMIRLER SET KAPALI = 1 WHERE UID = @UID",
            param : ['UID'],
            type : ['string|50'],
            value : [$scope.SipStokUid]
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            InsertAfterRefesh()
        });
    }
    $scope.SipListesi = function()
    {
        let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,MIKTAR,TESLIM_MIKTAR AS TESLIM,(SELECT ADI FROM STOKLAR WHERE EMIRLER.KODU = KODU) AS ADI FROM EMIRLER WHERE SERI =@SERI AND SIRA = @SIRA AND TIP = 1 AND CINS = 1  ",
                param : ['SERI','SIRA'],
                type : ['string|25','int'],
                value : [$scope.SipSeri,$scope.SipSira]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                console.log(Data)
                SipListeGrid(Data)
            });
    }
    $scope.CheckboxChange = function()
    {
        if($scope.PaletGonder == true)
        {
            $scope.RafLock = false;
        }
        if($scope.PaletGonder == false)
        {
            $scope.RafLock = true;
        }
        
    }
}