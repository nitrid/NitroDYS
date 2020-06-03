function SiparisMalKabul ($scope,$window,db)
{
    let SiparisSelectedRow = null;
    let IslemSelectedRow = null;

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
                console.log($scope.SiparisStok)

                db.GetData($scope.Firma,'SiparisStokGetir',[$scope.SipSeri,$scope.SipSira,$scope.SiparisStok,0,3],function(BarkodData)
                {  
                    if(BarkodData.length > 0)
                    { 
                        $scope.BarkodData = BarkodData
                        console.log($scope.BarkodData[0])
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
                {
                    name: "CARIADI",
                    title: "CARI ADI",
                    type: "text",
                    align: "center",
                    width: 150
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
                $scope.PaletKodu,
                $scope.DepoNo,
                $scope.CariKodu,
                1,
                $scope.Miktar * $scope.Katsayi,
                '',
                $scope.OzelUid,
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
                    console.log(Data)
                });

                db.GetData($scope.Firma,'PaletGetir',[$scope.PaletKodu],function(data)
                    {
                        console.log(data)
                        if(data.length <= 0)
                        {
                            console.log(1)
                            let InsertData =
                            [
                                UserParam.Kullanici,
                                UserParam.Kullanici,
                                $scope.PaletKodu,
                                $scope.StokKodu,
                                0,
                                $scope.Skt,
                                $scope.Miktar * $scope.Katsayi
                            ];
                            
                            db.ExecuteTag($scope.Firma,'PaletTanimlariKaydet',InsertData,function(InsertResult)
                            { 
                                if(typeof(InsertResult.result.err) == 'undefined')
                                {                          
                                    let InsertEtiket =
                                    [
                                        UserParam.Kullanici,
                                        UserParam.Kullanici,
                                        $scope.Seri,
                                        $scope.Sira,
                                        moment(new Date()).format("DD.MM.YYYY"),
                                        $scope.PaletKodu,
                                        $scope.StokKodu,
                                        "",
                                        "",
                                        1,
                                        1,
                                    ];
                                    db.ExecuteTag($scope.Firma,'EtiketKaydet',InsertEtiket,function(Result)
                                    { 
                                        InsertAfterRefesh();                                        
                                    });
                                }
                            });   
                        }
                        else
                        {
                            let UpdateData =
                            [
                                $scope.StokKodu,
                                $scope.Skt,
                                $scope.Miktar * $scope.Katsayi
                            ];
                            db.ExecuteTag($scope.Firma,'PaletTanimlariUpdate',UpdateData,function(UpdateResult)
                            {
                                console.log(UpdateResult)
                                InsertAfterRefesh();                 
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
        $scope.Katsayi = ''
        $scope.StokKodu = ''
        $scope.BekleyenMiktar = ''
        $scope.SipStokUid = ''
        $scope.SiparisStok = ''
        $scope.OzelUid = ''
        $scope.Skt = moment(new Date()).format("DD.MM.YYYY");

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

        $scope.MainClick();
        $scope.DepoGetir();

        db.MaxSira($scope.Firma,'EmirlerMaxSira',[$scope.Seri,0,3],function(data)
        {
            $scope.Sira = data
            console.log(data)
        });

        $scope.CariListe = [];
        $scope.DepoListe = [];


        InitIslemGrid()
        TblSiparisSecimGrid()
        TblSiparisStokGrid();

    }
    $scope.MainClick = function() 
    {
        $("#TbMain").addClass('active');
        $("#TbSiparisSecim").removeClass('active');
        $("#TbBelgeBilgisi").removeClass('active');
        $("#TbBarkodGiris").removeClass('active');
        $("#TbIslemSatirlari").removeClass('active');

    }
    $scope.BtnSiparisSecim = function()
    {
        $("#TbSiparisSecim").addClass('active');
        $("#TbMain").removeClass('active');
        $("#TbBelgeBilgisi").removeClass('active');
        $("#TbBarkodGiris").removeClass('active');
        $("#TbIslemSatirlari").removeClass('active');

        $scope.BtnCariListele()
    }
    $scope.BtnBelgeBilgisi =  function()
    {
        $("#TbBelgeBilgisi").addClass('active');
        $("#TbSiparisSecim").removeClass('active');
        $("#TbMain").removeClass('active');
        $("#TbBarkodGiris").removeClass('active');
        $("#TbIslemSatirlari").removeClass('active');
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
        if($scope.CariKodu == '')
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Lütfen Cari Seçiniz !" + "</a>" );
        }
        else
        {
            $("#TbBarkodGiris").addClass('active');
            $("#TbBelgeBilgisi").removeClass('active');
            $("#TbSiparisSecim").removeClass('active');
            $("#TbMain").removeClass('active');
        }
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
            Insert()   
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
        db.GetData($scope.Firma,'DepoGetir',[],function(data)
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
                
                query:  "SELECT SERI AS SERI,SIRA AS SIRA,GIRIS AS DEPO,(SELECT ADI FROM CARILER WHERE KODU = EMIRLER.CIKIS) AS CARIADI,(SELECT KODU FROM CARILER WHERE KODU = EMIRLER.CIKIS) AS CARIKODU,CINS FROM EMIRLER WHERE TIP = 0 AND CINS = 3 AND KAPALI <> 1 AND MIKTAR > TESLIM_MIKTAR AND TARIH>=@ILKTARIH AND TARIH<=@SONTARIH GROUP BY SERI,SIRA,GIRIS,CIKIS,TIP,CINS",
                param: ['ILKTARIH','SONTARIH'],
                type: ['date','date'],
                value:[$scope.SipTarih,$scope.SipTarih2]
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
                    alertify.alert("Sİpariş Tamamlandı !");
                }
              

            });
    }
    $scope.BtnSiparisListe = function()
    {
        $('#MdlSipListe').modal('show');
    }
    
}