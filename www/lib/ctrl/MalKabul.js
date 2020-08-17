function MalKabul ($scope,$window,db)
{
    let CariSelectedRow = null;
    let IslemSelectedRow = null;

    function StokBarkodGetir(pBarkod)
    {
       
            db.GetData($scope.Firma,'BarkodGetir',[pBarkod],function(BarkodData)
            {  
                if(BarkodData.length > 0)
                { 
                    $scope.BarkodData = BarkodData
                        console.log($scope.BarkodData[0])
                        $scope.StokAdi = $scope.BarkodData[0].STOKADI 
                        $scope.StokKodu = $scope.BarkodData[0].STOK
                        $scope.BirimAdi = $scope.BarkodData[0].BIRIMADI
                        $scope.Katsayi = $scope.BarkodData[0].KATSAYI
                        $scope.Miktar = 1;
                        
                        if(UserParam.Sistem.OtomatikParti == 1)
                        {
                            $scope.BtnPartiGenerate()
                        }

        
                        $window.document.getElementById("Miktar").focus();
                        $window.document.getElementById("Miktar").select();
                }
                else
                {
                    alertify.alert("<a style='color:#3e8ef7''>" + "Stok Bulunamamıştır !" + "</a>" );          
                    console.log("Stok Bulunamamıştır.");
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
                    type: "number",
                    align: "center",
                    width: 100
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
                $scope.PartiKodu,
                $scope.DepoNo,
                $scope.CariKodu,
                1,
                $scope.Miktar * $scope.Katsayi,
                '',
                '',
                '',
                $scope.Barkod
            ];
            db.ExecuteTag($scope.Firma,'EmirHarInsert',InsertData,function(InsertResult)
            {  
                
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
                            $scope.Miktar * $scope.Katsayi,
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
        $scope.PaletKodu = ''
        $scope.PartiKodu = ''
        $scope.Miktar = 1
        $scope.StokAdi = ''
        $scope.Birim = ''
        $scope.BirimAdi = ''
        $scope.Katsayi = ''
        $scope.StokKodu = ''
        $scope.Skt = moment(new Date()).format("DD.MM.YYYY");

        $window.document.getElementById("Barkod").focus();
        $window.document.getElementById("Barkod").select();

        db.GetData($scope.Firma,'EmirHarGetir',[0,3,$scope.Seri,$scope.Sira],function(data)
        {
            console.log(data)
            $scope.IslemListe = data 
            $("#TblIslem").jsGrid({data : $scope.IslemListe});    
        });
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
        $scope.IslemListe = []
        $scope.PartiKodu = ''


        $scope.MainClick();
        $scope.DepoGetir();

        db.MaxSira($scope.Firma,'EmirlerMaxSira',[$scope.Seri,0,3],function(data)
        {
            $scope.Sira = data
            console.log(data)
        });

        $scope.CariListe = [];
        $scope.DepoListe = [];

        document.getElementById("page-title").innerHTML = "Mal Kabul";
        document.getElementById("page-path").innerHTML = "Mal Kabul";

        InitCariGrid()
        InitIslemGrid()

    }
    $scope.MainClick = function() 
    {
        $("#TbMain").addClass('active');
        $("#TbCariSecim").removeClass('active');
        $("#TbBelgeBilgisi").removeClass('active');
        $("#TbBarkodGiris").removeClass('active');
        $("#TbIslemSatirlari").removeClass('active');

    }
    $scope.BtnCariSecim = function()
    {
        $("#TbCariSecim").addClass('active');
        $("#TbMain").removeClass('active');
        $("#TbBelgeBilgisi").removeClass('active');
        $("#TbBarkodGiris").removeClass('active');
        $("#TbIslemSatirlari").removeClass('active');

        $scope.BtnCariListele()
    }
    $scope.BtnBelgeBilgisi =  function()
    {
        $("#TbBelgeBilgisi").addClass('active');
        $("#TbCariSecim").removeClass('active');
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
            $("#TbCariSecim").removeClass('active');
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
            $("#TbCariSecim").removeClass('active');
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
    $scope.CariListeRowClick = function(pIndex,pItem,pObj)
    {
            if ( CariSelectedRow ) { CariSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
            var $row = pObj.rowByItem(pItem);
            $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
            CariSelectedRow = $row;
            
            $scope.CariKodu = $scope.CariListe[pIndex].KODU;
            $scope.CariAdi = $scope.CariListe[pIndex].ADI;
            
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
                    "",
                    $scope.BirimAdi,
                    1,
                    1,
                ];
                console.log(InsertEtiket)
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
    $scope.Gonder = function()
    {
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "UPDATE EMIR_HAREKETLERI SET AKTARIM = 2 WHERE SERI=@SERI AND SIRA = @SIRA",
            param: ['SERI:string|25','SIRA:int'],
            value: [ $scope.Seri,$scope.Sira]
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
           
        });
    }
}