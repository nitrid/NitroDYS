function SiparisMalKabul ($scope,$window,db)
{
    let SiparisSelectedRow = null;
    let IslemSelectedRow = null;
    let CariSelectedRow = null;

    function StokBarkodGetir(pBarkod)
    {
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT  STOK FROM BARKODLAR WHERE KODU = @KODU ",
            param : ['KODU'],
            type : ['string|25'],
            value : [pBarkod]
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            if(Data.length > 0)
            {
                    $scope.SiparisStok = Data[0].STOK
    
                    db.GetData($scope.Firma,'SiparisStokGetir',[$scope.SipSeri,$scope.SipSira,$scope.SiparisStok,0,3],function(BarkodData)
                    {  
                        if(BarkodData.length > 0)
                        { 
                            $scope.BarkodData = BarkodData

                            $scope.StokAdi = $scope.BarkodData[0].STOKADI 
                            $scope.StokKodu = $scope.BarkodData[0].KODU
                            $scope.BirimAdi = $scope.BarkodData[0].BIRIMADI
                            $scope.Katsayi = $scope.BarkodData[0].KATSAYI
                            $scope.Miktar = 1;
                            $scope.BekleyenMiktar = $scope.BarkodData[0].BEKLEYEN
                            $scope.SipStokUid = $scope.BarkodData[0].UID
                            
            
                            $window.document.getElementById("Miktar").focus();
                            $window.document.getElementById("Miktar").select();
                        }
                        else
                        {
                            alertify.alert("<a style='color:#3e8ef7''>" + "Stok Bu Siparişe Ait Değil !" + "</a>" );          
                            console.log("Stok Bu Siparişe Ait Değil.");
                            InsertAfterRefesh()
                        }
                    });
            }
            else
            {
                alertify.alert("<a style='color:#3e8ef7''>" + "Stok Bulunamamıştır !" + "</a>" ); 
                InsertAfterRefesh()         
            }
        });
       
           

    }
    function TblSiparisSecimGrid()
    {                
        $("#TblSipSecim").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : $scope.SiparisListe,
            paging : true,
            pageSize: 5,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: 
            [
                { 
                    itemTemplate: function(_, item) 
                    {
                        
                        return $("<button type='submit' class='btn btn-primary btn-block btn-sm'></button>").text("D")
                            .on("click", function() 
                            {
                                $scope.DetayGrid(item);
                            });
                    },
                    width: 45
                },
                {
                    name: "TARIH",
                    title: "TARIH",
                    type: "text",
                    align: "center",
                    width: 100
                },
              
                {
                    name: "CARIADI",
                    title: "CARI ADI",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "MIKTAR",
                    title: "MIKTAR",
                    type: "text",
                    align: "center",
                    width: 50
                },
                {
                    name: "SERI",
                    title: "SERI",
                    type: "text",
                    align: "center",
                    width: 50
                },
                {
                    name: "SIRA",
                    title: "SIRA",
                    type: "text",
                    align: "center",
                    width: 50
                },
            ],
            rowClick: function(args)
            {
                $scope.SiparisListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }

        });
    }
    function TblSiparisStokGrid()
    {                
        $("#TblSipListe").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : $scope.SiparisStokListe,
            paging : true,
            pageSize: 8,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: 
            [
                {
                    name: "ADI",
                    title: "ADI",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "MIKTAR",
                    title: "MİKTAR",
                    type: "text",
                    align: "center",
                    width: 50
                },
                {
                    name: "BEKLEYEN",
                    title: "BEKLEYEN MİKTAR",
                    type: "text",
                    align: "center",
                    width: 50
                },
                {
                    name: "TESLIM",
                    title: "TESLİM MİKTAR",
                    type: "text",
                    align: "center",
                    width: 50
                },
            ],

        });
    }
    function InitIslemGrid()
    {   
        $("#TblIslem").jsGrid({
            responsive: true,
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : $scope.IslemListe,
            paging : true,
            pageSize: 10,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            
            fields: 
            [
                {
                    name: "STOK",
                    title: "STOK KOD",
                    type: "number",
                    align: "center",
                    width: 75
                }, 
                {
                    name: "STOKADI",
                    title: "STOK ADI",
                    type: "text",
                    align: "center",
                    width: 100
                },
                {
                    name: "MIKTAR",
                    title: "MİKTAR",
                    type: "number",
                    align: "center",
                    width: 100
                },
            ],
            rowClick: function(args)
            {
                $scope.IslemListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }
        });
    }
    function InitCariGrid()
    {   
           

        let db = {
            loadData: function(filter) 
            {
                return $.grep($scope.CariListe, function(client) 
                { 
                    return (!filter.KODU || client.KODU.indexOf(filter.KODU) > -1)
                        && (!filter.ADI || client.ADI.indexOf(filter.ADI) > -1)
                });
            }
        };
        
        $("#TblCari").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : $scope.CariListe,
            paging : true,
            filtering : true,
            pageSize: 10,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: 
            [
                {
                    name: "KODU",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "ADI",
                    type: "text",
                    align: "center",
                    width: 200
                },
            ],
            rowClick: function(args)
            {
                $scope.CariListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            },
            controller:db,
        });
        $("#TblCari").jsGrid("search");
        console.log('ss')
    }
    function Insert()
    {
       
            let InsertData =
            [
                UserParam.Kullanici,
                UserParam.Kullanici,
                0,
                3,
                $scope.Tarih,
                $scope.Seri,
                $scope.Sira,
                $scope.StokKodu,
                $scope.PartiKodu,
                $scope.DepoNo,
                $scope.CariKodu,
                1,
                $scope.Miktar * $scope.Katsayi,
                $scope.OzelUid,
                $scope.SipStokUid,
                $scope.BelgeNo,
                $scope.Barkod
            ];
            db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
            { 
                let TmpQuery = 
                {
                    db : $scope.Firma,
                    query:  "UPDATE EMIRLER SET TESLIM_MIKTAR = (TESLIM_MIKTAR + @TESLIM) WHERE UID = @UID",
                    param : ['TESLIM','UID'],
                    type : ['float','string|50'],
                    value : [($scope.Miktar * $scope.Katsayi),$scope.SipStokUid]
                }
                db.GetDataQuery(TmpQuery,function(Data)
                {
                  
                    let TmpQuery = 
                    {
                        db : $scope.Firma,
                        query:  "UPDATE EMIRLER SET DURUM = 1 WHERE SERI = @SERI AND SIRA = @SIRA",
                        param : ['SERI','SIRA'],
                        type : ['string|50','int'],
                        value : [$scope.CariSipSeri,$scope.CariSipSira]
                    }
                    db.GetDataQuery(TmpQuery,function(Data)
                    {
                      
                    });
                });

               
                let InsertData =
                [
                    $scope.PaletKodu,
                    $scope.PartiKodu,
                    0,
                    $scope.Miktar * $scope.Katsayi,
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
                            $scope.Miktar * $scope.Katsayi
                        ];
                        
                        db.ExecuteTag($scope.Firma,'PartiInsert',InsertData,function(InsertResult)
                        { 
                            if(typeof(InsertResult.result.err) == 'undefined')
                            {                          
                                $scope.EtiketKontrol()
                            }
                        });   
                    }
                });   
            });  
       
           
    }
    InsertAfterRefesh = function()
    {
        $scope.Barkod = ''
        $scope
        $scope.PaletKodu = ''
        $scope.Miktar = 1
        $scope.StokAdi = ''
        $scope.Birim = ''
        $scope.BirimAdi = ''
        $scope.Katsayi = 1
        $scope.StokKodu = ''
        $scope.BekleyenMiktar = ''
        $scope.SipStokUid = ''
        $scope.SiparisStok = ''
        $scope.OzelUid = ''
        $scope.Skt = moment(new Date()).format("DD.MM.YYYY");
        $scope.PartiKodu = ''
        $scope.CariSipSeri = ''
        $scope.CariSipSira = 0

        if(UserParam.Sistem.OtomatikParti == 1)
        {
            $scope.BtnPartiGenerate()
        }

        $window.document.getElementById("Barkod").focus();
        $window.document.getElementById("Barkod").select();

        db.GetData($scope.Firma,'EmirHarGetir',[0,3,$scope.Seri,$scope.Sira],function(data)
        {
            console.log(data)
            $scope.IslemListe = data 
            $("#TblIslem").jsGrid({data : $scope.IslemListe});    
        });
        $scope.SipListesi();
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.Seri = UserParam.MalKabul.Seri
        $scope.Urun = ''
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");
        $scope.Skt = moment(new Date()).format("DD.MM.YYYY");
        $scope.CariAdi = ''
        $scope.CariKodu = ''
        $scope.PaletKodu = ''
        $scope.StokAdi = ''
        $scope.BekleyenMiktar = ''
        $scope.SiparisStok = ''
        $scope.SipStokUid = ''
        $scope.OzelUid = ''
        $scope.IslemListe = []
        $scope.SiparisStokListe = []
        $scope.SiparisListe = []
        $scope.SipTarih =  moment(new Date()).format("DD.MM.YYYY");
        $scope.SipTarih2 =  moment(new Date()).format("DD.MM.YYYY");
        $scope.EvrakgetirList = []
        $scope.PartiKodu = ''
        $scope.SipSeri = ''
        $scope.SipSira = 0
        $scope.BelgeNo = ''
        $scope.Yazici = "1"
        
        if(UserParam.Sistem.OtomatikParti == 1)
        {
            $scope.BtnPartiGenerate()
        }

       
        $scope.MainClick();
        $scope.DepoGetir();

        db.MaxSira($scope.Firma,'EmirlerMaxSira',[$scope.Seri,0,3],function(data)
        {
            $scope.Sira = data
            console.log(data)
        });

        $scope.CariListe = [];
        $scope.DepoListe = [];

        document.getElementById("page-title").innerHTML = "Siparişe Bağlı Mal Kabul";
        document.getElementById("page-path").innerHTML = "Siparişe Bağlı Mal Kabul";

        InitCariGrid()
        InitIslemGrid()
        TblSiparisSecimGrid()
        TblSiparisStokGrid();

    }
    $scope.CariListeRowClick = function(pIndex,pItem,pObj)
    {
            if ( CariSelectedRow ) { CariSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
            var $row = pObj.rowByItem(pItem);
            $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
            CariSelectedRow = $row;
            CariSelectedRow.Item = pItem
            CariSelectedRow.Index = pIndex

    }
    $scope.MainClick = function() 
    {
        $("#TbMain").addClass('active');
        $("#TbSiparisSecim").removeClass('active');
        $("#TbBelgeBilgisi").removeClass('active');
        $("#TbBarkodGiris").removeClass('active');
        $("#TbIslemSatirlari").removeClass('active');
        $("#TbCariSecim").removeClass('active');

    }
    $scope.BtnSiparisSecim = function()
    {
        if($scope.SipSira == 0)
        {
            $("#TbSiparisSecim").addClass('active');
            $("#TbMain").removeClass('active');
            $("#TbBelgeBilgisi").removeClass('active');
            $("#TbBarkodGiris").removeClass('active');
            $("#TbIslemSatirlari").removeClass('active');
            $("#TbCariSecim").removeClass('active');
        }
        else
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Lütfen Yeni Evrağa Geçin !" + "</a>" );
        }

        $scope.BtnCariListele()
    }
    $scope.BtnBelgeBilgisi =  function()
    {
        $("#TbBelgeBilgisi").addClass('active');
        $("#TbSiparisSecim").removeClass('active');
        $("#TbMain").removeClass('active');
        $("#TbBarkodGiris").removeClass('active');
        $("#TbIslemSatirlari").removeClass('active');
        $("#TbCariSecim").removeClass('active');
    }
    $scope.BtnIslemSatirlari = function()
    {
        if($scope.IslemListe.length < 0)
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Henüz İşlem Yapılmadı !" + "</a>" );
        }
        else
        {
            $("#TbIslemSatirlari").addClass('active');
            $("#TbBelgeBilgisi").removeClass('active');
            $("#TbSiparisSecim").removeClass('active');
            $("#TbMain").removeClass('active');
            $("#TbBarkodGiris").removeClass('active');
        }
        
    }
    $scope.BtnBarkodGiris =  function()
    {
        if($scope.SipSira == 0)
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Lütfen Sipariş Seçiniz !" + "</a>" );
        }
        else
        {
            $("#TbBarkodGiris").addClass('active');
            $("#TbBelgeBilgisi").removeClass('active');
            $("#TbSiparisSecim").removeClass('active');
            $("#TbMain").removeClass('active');
            $scope.SipListesi();
        }
    }
    $scope.BtnGridSec = function()
    {
        $scope.CariKodu = CariSelectedRow.Item.KODU;
        $scope.CariAdi = CariSelectedRow.Item.ADI;
        $scope.MainClick();
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
        if($scope.StokKodu == '')
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Lütfen Stok Okutunuz !" + "</a>" );
        }
        else if($scope.PaletKodu == '')
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Palet Kodunuz Boş !" + "</a>" );
        }
        else
        {

            if($scope.BekleyenMiktar >= ($scope.Miktar * $scope.Katsayi))
            {
                Insert()   
            }
            else
            {
                alertify.confirm('Girdiğiniz Miktar Siparişi Aşıyor . Devam Etmek İstiyormusunuz ?', 
                function()
                { 
                    Insert()   
                }
                ,function(){}).set('labels',{ok: 'Evet',cancel: 'Hayır'});
            }
          
        }
    }
    $scope.BtnCariListele = function()
    {   
        
        db.GetData($scope.Firma,'CariGetir',[],function(data)
        {
            $scope.CariListe = data;
            if($scope.CariListe.length > 0)
            {
                $("#TblCari").jsGrid({data : $scope.CariListe});
                $("#TblCari").jsGrid({pageIndex: true})
            } 
            else
            {
                alertify.alert("Cari Bulunamadı")
                $("#TblCari").jsGrid({data : $scope.CariListe});
                $("#TblCari").jsGrid({pageIndex: true})
            }     
            
        });
    }
    $scope.SiparisListeRowClick = function(pIndex,pItem,pObj)
    {
            if ( SiparisSelectedRow ) { SiparisSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
            var $row = pObj.rowByItem(pItem);
            $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
            SiparisSelectedRow = $row;
            $scope.SiparisListeSelectedIndex = pIndex;
    }
    $scope.BtnSipSec = function()
    {
        $scope.SipSeri = $scope.SiparisListe[$scope.SiparisListeSelectedIndex].SERI;
        $scope.SipSira = $scope.SiparisListe[$scope.SiparisListeSelectedIndex].SIRA;
        $scope.CariAdi =  $scope.SiparisListe[$scope.SiparisListeSelectedIndex].CARIADI;
        $scope.CariKodu =  $scope.SiparisListe[$scope.SiparisListeSelectedIndex].CARIKODU;
        $scope.DepoNo =  $scope.SiparisListe[$scope.SiparisListeSelectedIndex].DEPO;
        $scope.DepoChange();
        $scope.SipListesi();

        $scope.MainClick();
    }
    $scope.DepoGetir = function()
    {
        db.GetData($scope.Firma,'DepoGetir',[0],function(data)
        {
            $scope.DepoListe = data   
            $scope.DepoNo = UserParam.MalKabul.DepoNo
            $scope.DepoChange()
        });
    }
    $scope.DepoChange = function()
    {
        $scope.DepoListe.forEach(function(item) 
        {
            if(item.KODU == $scope.DepoNo)
                $scope.DepoAdi = item.ADI;
        });
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
    }
    $scope.BtnSil = function()
    {
        alertify.confirm('Evrağı silmek istediğinize eminmisiniz ?', 
        function()
        { 
            if($scope.IslemListe.length > 0)
            {
                db.ExecuteTag($scope.Firma,'EmırHarDelete',[0,3,$scope.Seri,$scope.Sira],function(InsertResult)
                { 
                    console.log(InsertResult)
                    if(typeof(InsertResult.result.err) == 'undefined')
                    {
                        alertify.alert("<a style='color:#3e8ef7''>" + "Silme İşlemi Başarılı !" + "</a>" );
                        
                        db.GetData($scope.Firma,'EmirHarGetir',[0,3,$scope.Seri,$scope.Sira],function(data)
                        {
                            console.log(data)
                            $scope.IslemListe = data 
                            $("#TblIslem").jsGrid({data : $scope.IslemListe});    
                        });
                        InsertAfterRefesh(); 
                        $scope.Init();
                        
                    }
                });   
            }
            else
            {
                alertify.alert("Kayıtlı evrak olmadan evrak silemezsiniz !");
            }
        }
        ,function(){});
    }
    $scope.BtnSatirSil = function()
    {
        alertify.confirm('Satırı silmek istediğinize eminmisiniz ?', 
        function()
        { 
            if($scope.IslemListe.length > 0)
            {
                let TmpQuery = 
                {
                    db : $scope.Firma,
                    query:  "DELETE FROM PARTILER WHERE KODU = @KODU AND STOK = @STOK ",
                    param : ['KODU','STOK'],
                    type : ['string|50','string|50'],
                    value : [$scope.IslemListe[$scope.IslemListeSelectedIndex].PARTI,$scope.IslemListe[$scope.IslemListeSelectedIndex].STOK]
                }
                console.log(TmpQuery)
                db.GetDataQuery(TmpQuery,function(Data)
                {
                    let TmpQuery = 
                    {
                        db : $scope.Firma,
                        query:  "UPDATE EMIRLER SET TESLIM_MIKTAR = (TESLIM_MIKTAR - @MIKTAR) WHERE UID = @UID ",
                        param : ['MIKTAR','UID'],
                        type : ['float','string|50'],
                        value : [$scope.IslemListe[$scope.IslemListeSelectedIndex].MIKTAR,$scope.IslemListe[$scope.IslemListeSelectedIndex].EMIRID]
                    }
                    console.log(TmpQuery)
                    db.GetDataQuery(TmpQuery,function(Data)
                    {
                        db.ExecuteTag($scope.Firma,'EmırHarSatirDelete',[0,3,$scope.Seri,$scope.Sira,$scope.IslemListe[$scope.IslemListeSelectedIndex].SATIRNO],function(InsertResult)
                        { 
                            console.log(InsertResult)
                            if(typeof(InsertResult.result.err) == 'undefined')
                            {
                                alertify.alert("<a style='color:#3e8ef7''>" + "Silme İşlemi Başarılı !" + "</a>" );
                                
                                db.GetData($scope.Firma,'EmirHarGetir',[0,3,$scope.Seri,$scope.Sira],function(data)
                                {
                                    console.log(data)
                                    $scope.IslemListe = data 
                                    $("#TblIslem").jsGrid({data : $scope.IslemListe});    
                                });
                                InsertAfterRefesh(); 
                                
                            }
                        });   
                    })
                });
                
            }
            else
            {
                alertify.alert("Kayıtlı evrak olmadan evrak silemezsiniz !");
            }
        }
        ,function(){});
    }
    $scope.IslemListeRowClick = function(pIndex,pItem,pObj)
    {
        if ( IslemSelectedRow ) { IslemSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        IslemSelectedRow = $row;
        console.log(pIndex)
        $scope.IslemListeSelectedIndex = pIndex;
    }
    $scope.BtnTemizle = function()
    {
        InsertAfterRefesh()
    }
    function SiparisListele()
    {
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                
                query:  "SELECT SERI AS SERI,SIRA AS SIRA,CONVERT(VARCHAR(10),TARIH,104) AS TARIH,GIRIS AS DEPO,SUM(MIKTAR) AS MIKTAR,(SELECT ADI FROM CARILER WHERE KODU = EMIRLER.CIKIS) AS CARIADI, " +
                "(SELECT KODU FROM CARILER WHERE KODU = EMIRLER.CIKIS) AS CARIKODU,CINS FROM EMIRLER " + 
                " WHERE TIP = 0 AND CINS = 3 AND KAPALI <> 1 AND MIKTAR > TESLIM_MIKTAR AND TARIH> = (GETDATE() - 20) AND TARIH<=@SONTARIH AND ((CIKIS = @CARI) OR (@CARI = '')) GROUP BY SERI,SIRA,GIRIS,CIKIS,TIP,CINS,TARIH",
                param: ['ILKTARIH','SONTARIH','CARI'],
                type: ['date','date','string|25'],
                value:[$scope.SipTarih,$scope.SipTarih2,$scope.CariKodu]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                console.log(Data)
                $scope.SiparisListe = Data
                $("#TblSipSecim").jsGrid({data : $scope.SiparisListe});


            });
        }
    }
    $scope.BtnSipListele = function()
    {
        SiparisListele()
    }
    $scope.SipListesi = function()
    {
        console.log($scope.SipSeri)
        if($scope.SipSeri == '')
        {
            console.log($scope.CariKodu)
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,MIKTAR AS MIKTAR,TESLIM_MIKTAR AS TESLIM,MIKTAR - TESLIM_MIKTAR AS BEKLEYEN,(SELECT ADI FROM STOKLAR WHERE EMIRLER.KODU = KODU) AS ADI FROM EMIRLER WHERE CIKIS = @CARI AND TIP = 0 AND CINS = 3 AND MIKTAR > TESLIM_MIKTAR  AND TARIH > GETDATE()- 30 ",
                param : ['CARI'],
                type : ['string|50',],
                value : [$scope.CariKodu]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                console.log()
                if(Data.length > 0)
                {
                    $scope.SiparisStokListe = Data
                    $("#TblSipListe").jsGrid({data : $scope.SiparisStokListe});
                    $("#TblSipListe").jsGrid({pageIndex: true});
                }
                else
                {
                    $scope.SiparisStokListe = Data
                    $("#TblSipListe").jsGrid({data : $scope.SiparisStokListe});
                    alertify.alert("Sipariş Bulunmuyor !");
                    $("#TblSipListe").jsGrid({pageIndex: true});
                }
            });  
        }
        else
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,MIKTAR,TESLIM_MIKTAR AS TESLIM,(SELECT ADI FROM STOKLAR WHERE EMIRLER.KODU = KODU) AS ADI FROM EMIRLER WHERE SERI =@SERI AND SIRA = @SIRA AND TIP = 0 AND CINS = 3 AND MIKTAR > TESLIM_MIKTAR  ",
                param : ['SERI','SIRA'],
                type : ['string|25','int'],
                value : [$scope.SipSeri,$scope.SipSira]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                if(Data.length > 0)
                {
                    $scope.SiparisStokListe = Data
                    $("#TblSipListe").jsGrid({data : $scope.SiparisStokListe});
                }
                else
                {
                    $scope.SiparisStokListe = Data
                    $("#TblSipListe").jsGrid({data : $scope.SiparisStokListe});
                    alertify.alert("Sipariş Tamamlandı !");
                }
            });
            
        }
       
    }
    $scope.DetayGrid = function(pItem)
    {
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT KODU,MIKTAR,TESLIM_MIKTAR AS TESLIM,(SELECT ADI FROM STOKLAR WHERE EMIRLER.KODU = KODU) AS ADI FROM EMIRLER WHERE SERI =@SERI AND SIRA = @SIRA AND TIP = 0 AND CINS = 3 AND MIKTAR > TESLIM_MIKTAR  ",
            param : ['SERI','SIRA'],
            type : ['string|25','int'],
            value : [pItem.SERI,pItem.SIRA]
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            if(Data.length > 0)
            {
                $scope.SiparisStokListe = Data
                $("#TblSipListe").jsGrid({data : $scope.SiparisStokListe});
                $('#MdlSipListe').modal('show');
            }
            else
            {
                $scope.SiparisStokListe = Data
                $("#TblSipListe").jsGrid({data : $scope.SiparisStokListe});
                alertify.alert("Sipariş Tamamlandı !");
            }
        });
    }
    $scope.BtnSiparisListe = function()
    {
        $('#MdlSipListe').modal('show');
    }
    $scope.EtiketKontrol = function()
    {
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT * FROM ETIKET WHERE PALET = @PALET ",
            param: ['PALET:string|25'],
            value: [ $scope.PaletKodu]
        }

        db.GetDataQuery(TmpQuery,function(Data)
        {
            if(Data.length <= 0 )
            {
                let InsertEtiket =
                [
                    UserParam.Kullanici,
                    UserParam.Kullanici,
                    $scope.Seri,
                    $scope.Sira,
                    moment(new Date()).format("DD.MM.YYYY"),
                    $scope.PartiKodu,
                    $scope.PaletKodu,
                    $scope.StokKodu,
                    $scope.Barkod,
                    $scope.BirimAdi,
                    1,
                    $scope.Yazici,
                ];
                db.ExecuteTag($scope.Firma,'EtiketKaydet',InsertEtiket,function(Result)
                { 
                    InsertAfterRefesh()
                });
            }
            else
            {
                InsertAfterRefesh()
            }
        });
    }
    $scope.EvrakGetir = function()
    {
        db.GetData($scope.Firma,'MalKabulEvrakGetir',[$scope.Seri,$scope.Sira],function(data)
        {
            $scope.IslemListe = data 
            $("#TblIslem").jsGrid({data : $scope.IslemListe});  
            $scope.CariKodu = data[0].CIKIS
            $scope.CariAdi = data[0].CARIADI
            $('#MdlEvrakGetir').modal('hide');

        });
    }
    $scope.BtnEvrakGetir = function()
    {
        $('#MdlEvrakGetir').modal('show');
    }
    $scope.BtnCariSecim = function()
    {
        if($scope.CariKodu == '')
        {
            $("#TbCariSecim").addClass('active');
            $("#TbMain").removeClass('active');
            $("#TbBelgeBilgisi").removeClass('active');
            $("#TbBarkodGiris").removeClass('active');
            $("#TbIslemSatirlari").removeClass('active');
            $("#TbSiparisSecim").removeClass('active');
        }
        else
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Yeni Evrağa Geçmeden Cari Değiştiremezsiniz !" + "</a>" );    
        }
       

        $scope.BtnCariListele()
    }
    $scope.Gonder = function()
    {
          
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "UPDATE EMIR_HAREKETLERI SET DURUM = 2 WHERE SERI = @SERI AND SIRA = @SIRA AND TIP = 0 AND CINS = 3", 
            param: ['SERI','SIRA'],
            type: ['string|50','int'],
            value:[$scope.Seri,$scope.Sira]
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Evrak Gönderildi !" + "</a>" );    
            for(let i = 0;i < $scope.IslemListe;i++)

            {
                let TmpQuery = 
                {
                    db : $scope.Firma,
                    query:  "UPDATE EMIRLER SET DURUM = 2 WHERE UID = @UID", 
                    param: ['UID'],
                    type: ['string|50'],
                    value:[$scope.IslemListe[i].EMIRID]
                }
                db.GetDataQuery(TmpQuery,function(Data)
                {
                   
                });
            }
        });
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