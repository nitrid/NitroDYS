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
            pageSize: 15,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: 
            [
                {
                    name: "SUBE",
                    title: "SUBE",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "SIPDURUM",
                    title: "DURUM",
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
                
                query:  "SELECT SERI AS SERI,SIRA AS SIRA,(SELECT top 1 ADI FROM DEPOLAR WHERE KODU = EMIR.GIRIS) AS SUBE,DURUM AS DURUM,GIRIS AS GIRIS, " +
                "CASE EMIR.DURUM WHEN 0 THEN 'BEKLIYOR' WHEN 1 THEN 'TOPLANIYOR' WHEN 2 THEN 'TAMAMLANMIŞ' END AS SIPDURUM, TIP,CINS FROM EMIRLER AS EMIR " +
                "INNER JOIN PALET_VIEW_01 AS PALET ON EMIR.KODU = PALET.STOK " +
                "WHERE EMIR.TIP = 1 AND EMIR.CINS = 2 AND EMIR.TARIH>=@ILKTARIH AND EMIR.TARIH<=@SONTARIH AND (SELECT TOP 1 KATEGORI FROM RAFLAR WHERE KODU = PALET.RAF) = @RAFTIP " +
                "AND EMIR.KAPALI <> 1 AND EMIR.MIKTAR > EMIR.TESLIM_MIKTAR GROUP BY SERI,SIRA,GIRIS,TIP,CINS,DURUM ORDER BY (SELECT top 1 ADI FROM DEPOLAR WHERE KODU = EMIR.GIRIS) ",
                param: ['ILKTARIH','SONTARIH','RAFTIP'],
                type: ['date','date','string|25'],
                value:[$scope.SipTarih,$scope.SipTarih2,$scope.RafTip]
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
        $scope.SipGiris = SiparisSelectedRow.Item.GIRIS
        console.log(SiparisSelectedRow.Item.GIRIS)
    }
    function StokBarkodGetir(pBarkod)
    {
        if($scope.PaletGonder == false)
        { console.log(pBarkod)
            db.GetData($scope.Firma,'BarkodGetir',[pBarkod],function(BarkodData)
            {  
                if(BarkodData.length > 0)
                { 
                    $scope.BarkodData = BarkodData
                    if($scope.SipStokKodu == $scope.BarkodData[0].STOK)
                    {
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
                        $scope.Barkod = ''
                    }
                }
                else
                {
                    alertify.alert("<a style='color:#3e8ef7''>" + "Stok Bulunamamıştır !" + "</a>" );          
                    console.log("Stok Bulunamamıştır.");
                    $scope.Barkod = ''
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
                UserParam.Kullanici,
                1,
                2,
                $scope.Tarih,
                $scope.Seri,
                $scope.Sira,
                $scope.Stokkodu,
                '',
                $scope.GirisSube,
                1,
                $scope.Birim,
                $scope.Miktar,
                $scope.OzelUid,
                $scope.SipStokUid,
                '',
                $scope.Barkod
            ];
            console.log(InsertData)
            db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
            { 
                console.log(InsertResult)

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
                        console.log(Data)
                        InsertAfterRefesh()
                    });
                }
            });  
        }
        else
        {
            let InsertData1 =
            [
                UserParam.Kullanici,
                UserParam.Kullanici,
                0,
                1,
                $scope.Tarih,
                '',
                0,
                $scope.PaletStok,
                $scope.PaletKodu,
                $scope.PaletRafKodu,
                $scope.PaletRafKodu,
                1,
                $scope.Miktar,
                '',
                '',
                '',
                $scope.Barkod
            ];
            db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData1,function(InsertResult)
            { 
               
                if(typeof(InsertResult.result.err) == 'undefined')
                {  
                    let InsertData =
                    [
                        UserParam.Kullanici,
                        UserParam.Kullanici,
                        1,
                        1,
                        $scope.Tarih,
                        '',
                        0,
                        $scope.PaletStok,
                        $scope.PaletKodu,
                        $scope.Raf,
                        $scope.Raf,
                        1,
                        $scope.Miktar,
                        '',
                        '',
                        '',
                        $scope.Barkod
                    ];
                    db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
                    { 
                        let InsertData2 =
                        [
                            UserParam.Kullanici,
                            UserParam.Kullanici,
                            1,
                            2,
                            $scope.Tarih,
                            $scope.Seri,
                            $scope.Sira,
                            $scope.PaletStok,
                            '',
                            $scope.GirisSube,
                            1,
                            $scope.Birim,
                            $scope.Miktar,
                            '',
                            $scope.SipStokUid,
                            '',
                            $scope.Barkod
                        ];
                        db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData2,function(InsertResult)
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
                                    InsertAfterRefesh()
                                    console.log('basarılı')
                                });
                            }
                        }); 
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
        $scope.OzelUid = ''
        $scope.Urun = ''
        $scope.Raf = ''
        $scope.Sube = ''
        $scope.SipStokUid = ''
        $scope.SipStokKodu = ''
        $scope.GirisSube = ''
        $scope.Birim = ''
        $scope.BirimAdi = ''
        $scope.Katsayi = 1
        $scope.PaletRafKodu = ''
        $scope.BtnSipSec()
        $scope.PaletGonder = false;
        $window.document.getElementById("Barkod").focus();
        $window.document.getElementById("Barkod").select();
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.Seri =  UserParam.SubeEmirKapama.Seri
        $scope.Urun = ''
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");
        $scope.SipTarih =   new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.SipTarih2 =  new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.PaletGonder = false;
        $scope.RafLock = true;
        $scope.PaletRafKodu = ''
        $scope.RafTip = '01'
        $scope.Barkod = ''
        $scope.OzelUid = ''
        $scope.Miktar = 1
        $scope.MainClick();
        db.MaxSira($scope.Firma,'EmirlerMaxSira',[$scope.Seri,1,2],function(data)
        {
            $scope.Sira = data
            console.log(data)
        });

        document.getElementById("page-title").innerHTML = "Şube Emri Kapatma";
        document.getElementById("page-path").innerHTML = "Şube Emri Kapatma";

        SiparisListele()
        TblSiparisSecimGrid()
    }
    $scope.BtnInit = function()
    {
        alertify.confirm('Dikkat !','Yeni Evrağa Geçmek istediğinize eminmisiniz ?', 
        function()
        { 
            $scope.Init()
        }
        ,function(){}).set('labels',{ok: 'Evet',cancel: 'Hayır'});
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
    $scope.BtnSipSecClick = function()
    {
      
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "UPDATE EMIRLER SET DURUM = 1 WHERE SERI = @SERI AND SIRA = @SIRA AND TIP = 1 AND CINS = 2", 
                param: ['SERI','SIRA'],
                type: ['string|50','int'],
                value:[$scope.SipSeri,$scope.SipSira]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                console.log(1)
                $scope.BtnSipSec();
                $scope.Seri = $scope.SipSeri
                $scope.Sira = $scope.SipSira
            });
       
    }
    $scope.BtnSipSec = function()
    {
        db.GetData($scope.Firma,'EmirGetir',[$scope.SipSeri,$scope.SipSira,1,2],function(data)
        {
            console.log(data)
            $scope.SiparisStok = data;
            if($scope.SiparisStok == '')
            {
                alertify.alert("<a style='color:#3e8ef7''>" + "Şube Emir Kapanmıştır !" + "</a>" );          
                console.log("Stok Bulunamamıştır.");
                let TmpQuery = 
                    {
                        db : $scope.Firma,
                        query:  "UPDATE EMIRLER SET DURUM = 2 WHERE SERI = @SERI AND SIRA = @SIRA AND TIP = 1 AND CINS = 2", 
                        param: ['SERI','SIRA'],
                        type: ['string|50','int'],
                        value:[$scope.SipSeri,$scope.SipSira]
                    }
                    db.GetDataQuery(TmpQuery,function(Data)
                    {
                        let TmpQuery = 
                        {
                            db : $scope.Firma,
                            query:  "UPDATE EMIR_HAREKETLERI SET DURUM = 2 WHERE SERI = @SERI AND SIRA = @SIRA AND TIP = 1 AND CINS = 2", 
                            param: ['SERI','SIRA'],
                            type: ['string|50','int'],
                            value:[$scope.Seri,$scope.Sira]
                        }
                        db.GetDataQuery(TmpQuery,function(Data)
                        {
                            console.log(1)
                        });
                    });
                $scope.SipListesi();
            }
            else
            {
                $scope.Urun = $scope.SiparisStok[0].STOKADI;
                $scope.Raf = $scope.SiparisStok[0].RAFKODU;
                $scope.Sube = $scope.SiparisStok[0].SUBEADI;
                $scope.SipStokUid = $scope.SiparisStok[0].EMIRUID;
                $scope.SipStokKodu = $scope.SiparisStok[0].STOKKOD;
                $scope.GirisSube = $scope.SiparisStok[0].GIRISSUBE
                $scope.Birim = $scope.SiparisStok[0].BIRIM
                $scope.BirimAdi = $scope.SiparisStok[0].BIRIMADI
                $scope.Katsayi = 1
                $scope.RafLock = true;
                $scope.OzelUid = $scope.SiparisStok[0].OZEL

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
                $window.document.getElementById("Barkod").focus();
                $window.document.getElementById("Barkod").select();
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
        if($scope.Barkod == '')
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Barkod Okutmadan Ekleme Yapılamaz !" + "</a>" );   
        }
        else
        {
            if($scope.Miktar > $scope.BekleyenMiktar)
            {
                alertify.confirm('Dikkat !','Bekleyen Miktardan Fazla Ürün Girdiniz Devam Etmek İstiyorumsunuz ?', 
                function()
                { 
                    Insert()
                }
                ,function(){}).set('labels',{ok: 'Evet',cancel: 'Hayır'});
            }
            else
            {
                Insert()
            }
            
        }
      
    }
    $scope.Kapat = function()
    {
        alertify.confirm('Dikkat !','Ürünü Kapatmak İstediğinize Eminmisiniz ?', 
        function()
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
        ,function(){}).set('labels',{ok: 'Evet',cancel: 'Hayır'});
        
    }
    $scope.SipListesi = function()
    {
        let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,MIKTAR,TESLIM_MIKTAR AS TESLIM,(SELECT ADI FROM STOKLAR WHERE EMIRLER.KODU = KODU) AS ADI FROM EMIRLER WHERE SERI =@SERI AND SIRA = @SIRA AND TIP = 1 AND CINS = 2  ",
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
    $scope.BtnTemizle = function()
    {
        $scope.Barkod = ''
    }
}