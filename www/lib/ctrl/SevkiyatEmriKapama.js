function SevkiyatEmriKapama ($scope,$window,db)
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
                    name: "EMIRNO",
                    title: "EMIRNO",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "TASIYICI",
                    title: "TASIYICI",
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
                
                query:  "SELECT EMIRNO AS EMIRNO,(SELECT ADI FROM PERSONEL WHERE KODU = EMIRLER.TASIYICI) AS TASIYICI ,TIP,CINS FROM EMIRLER WHERE TIP = 1 AND EMIRNO <> 0 AND CINS = 3 AND KAPALI <> 1 AND MIKTAR > TESLIM_MIKTAR AND TARIH>=@ILKTARIH AND TARIH<=@SONTARIH GROUP BY EMIRNO,TASIYICI,TIP,CINS",
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
        $scope.SipEmirNo = SiparisSelectedRow.Item.EMIRNO;
    }
    function StokBarkodGetir(pBarkod)
    {
        db.GetData($scope.Firma,'BarkodGetir',[pBarkod],function(BarkodData)
        {  
            if(BarkodData.length > 0)
            { 
                $scope.BarkodData = BarkodData
                console.log(1)
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
    async function Insert()
    {
        let TmpUrunMiktar = ($scope.Miktar * $scope.Katsayi)
        
        if($scope.BekleyenMiktar >= TmpUrunMiktar)
        {
            if($scope.PalettekiMiktar >= TmpUrunMiktar)
            {
                for (let i = 0; i < $scope.SiparisStok.length; i++) 
                {
                    let TmpMiktar = 0;

                    if(TmpUrunMiktar >= $scope.SiparisStok[i].MIKTAR)
                    {
                        TmpMiktar = $scope.SiparisStok[i].MIKTAR;
                    }
                    else
                    {
                        TmpMiktar = TmpUrunMiktar;
                    }

                    let InsertData =
                    [
                        UserParam.Kullanici,
                        UserParam.Kullanici,
                        1,
                        3,
                        $scope.Tarih,
                        $scope.Seri,
                        $scope.Sira,
                        $scope.SiparisStok[i].STOKKOD,
                        $scope.SiparisStok[i].PARTI,
                        $scope.SiparisStok[i].CARI,
                        $scope.SiparisStok[i].DEPO,
                        $scope.Birim,
                        TmpMiktar,
                        $scope.SiparisStok[i].OZEL,
                        $scope.SiparisStok[i].UID,
                    ];

                    let InsertResult = await db.ExecutePromiseTag($scope.Firma,'EmirHarInsert',InsertData);

                    if(typeof(InsertResult.result.err) == 'undefined')
                    {
                        let TmpQuery = 
                        {
                            db : $scope.Firma,
                            query:  "UPDATE RAFLAR SET MIKTAR = (MIKTAR - @MIKTAR) WHERE KODU = @RAF " +
                                    "UPDATE PALETLER SET MIKTAR = (MIKTAR - @MIKTAR) WHERE KODU = @PALET " +
                                    "UPDATE PARTILER SET MIKTAR = (MIKTAR - @MIKTAR) WHERE KODU = @PARTI " + 
                                    "UPDATE EMIRLER SET TESLIM_MIKTAR = (TESLIM_MIKTAR + @MIKTAR) WHERE UID = @UID ",
                            param : ['MIKTAR','RAF','PALET','PARTI','UID'],
                            type : ['float','string|25','string|50','string|15','string|50'],
                            value : [TmpMiktar,$scope.SiparisStok[0].RAFKODU,$scope.SiparisStok[0].PALET, $scope.SiparisStok[i].PARTI,$scope.SiparisStok[i].UID]
                        }

                        let UpdateResult = await db.ExecutePromiseQuery(TmpQuery);

                        if(typeof(UpdateResult.result.err) == 'undefined')
                        {
                            let DataResult = await db.GetPromiseTag($scope.Firma,'SevkiyatEmriGetir',[1,3,$scope.SipEmirNo]);
                            
                            $scope.BekleyenMiktar = db.SumColumn($scope.SiparisStok,"BEKLEYEN","STOKKOD = " + $scope.SiparisStok[0].STOKKOD);
                            TmpUrunMiktar = TmpUrunMiktar - TmpMiktar
                            
                            if(TmpUrunMiktar <= 0)
                            {
                                InsertAfterRefesh();
                                return;
                            }
                        }
                        else
                        {
                            console.log(UpdateResult.result.err);    
                        }
                    }
                    else
                    {
                        console.log(InsertResult.result.err);
                    }
                }
            }
            else
            {
                alertify.alert("<a style='color:#3e8ef7''>" + "SKT Miktarı  Gönderdiğiniz Miktardan Düşüktür ! Lütfen Önce " + $scope.PalettekiMiktar+ " Adet Gönderiniz" + "</a>" );          
            }
        }
        else
        {
            alertify.alert("<a style='color:#3e8ef7''>" + "Miktar Bekleyen Miktardan Büyük Olamaz !" + "</a>" ); 
        }
    }
    InsertAfterRefesh = function()
    {
        $scope.Barkod = ''
        $scope.Miktar = 1
        $scope.StokAdi = ''
        $scope.BekleyenMiktar = 0
        $scope.Urun = ''
        $scope.Raf = ''
        $scope.RafOkut =''
        $scope.Cari = ''
        $scope.SipStokKodu = ''
        $scope.Birim = ''
        $scope.BirimAdi = ''
        $scope.Katsayi = 1
        $scope.PalettekiMiktar = 0
        $scope.Parti = ''
        $scope.BtnSipSec()
        $window.document.getElementById("RafOkut").focus();
        $window.document.getElementById("RafOkut").select();
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.Seri = 'MOP'
        $scope.Urun = ''
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");
        $scope.SipTarih =   new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.SipTarih2 =  new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.MainClick();
        
        db.MaxSira($scope.Firma,'EmirlerMaxSira',[$scope.Seri,1,3],function(data)
        {
            $scope.Sira = data
        });

        document.getElementById("page-title").innerHTML = "Toplama Emri Kapatma";
        document.getElementById("page-path").innerHTML = "Toplama Emri Kapatma";

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
        db.GetData($scope.Firma,'SevkiyatEmriGetir',[1,3,$scope.SipEmirNo],function(data)
        {
            $scope.SiparisStok = data;
            if($scope.SiparisStok == '')
            {
                alertify.alert("<a style='color:#3e8ef7''>" + "Emir Kapanmıştır !" + "</a>" );          
                console.log("Stok Bulunamamıştır.");
                $scope.SipListesi();
            }
            else
            {
                $scope.Urun = $scope.SiparisStok[0].STOKADI;
                $scope.Raf = $scope.SiparisStok[0].RAFKODU;
                $scope.PalettekiMiktar = $scope.SiparisStok[0].PALETMIKTAR;
                $scope.SipStokKodu = $scope.SiparisStok[0].STOKKOD;
                $scope.Birim = $scope.SiparisStok[0].BIRIM
                $scope.BirimAdi = $scope.SiparisStok[0].BIRIMADI
                $scope.Katsayi = $scope.SiparisStok[0].KATSAYI
                $scope.Parti =  $scope.SiparisStok[0].PARTI
                $scope.BekleyenMiktar = db.SumColumn($scope.SiparisStok,"BEKLEYEN","STOKKOD = " + $scope.SiparisStok[0].STOKKOD);

                $scope.SipListesi();
    
                $("#TbSiparisGiris").addClass('active');
                $("#TbSiparisSecim").removeClass('active');
                $window.document.getElementById("RafOkut").focus();
                $window.document.getElementById("RafOkut").select();
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
    $scope.BtnRafKoduOkut = function(keyEvent)
    {
        $scope.RafOkut = $scope.RafOkut + '-0'
        if(keyEvent.which === 13)
        {
          if($scope.Raf == $scope.RafOkut)
          {
            $window.document.getElementById("Barkod").focus();
            $window.document.getElementById("Barkod").select();
          }
          else
          {
            alertify.alert("<a style='color:#3e8ef7''>" + "Yanlış Raf Okuttunuz !" + "</a>" );      
            $scope.BtnRafTemizle();
          }


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
        $scope.ToplamMiktar =  $scope.Katsayi * $scope.Miktar;
        Insert();   
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
            InsertAfterRefesh();
        });
    }
    $scope.SipListesi = function()
    {
        let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,MIKTAR,TESLIM_MIKTAR AS TESLIM,(SELECT ADI FROM STOKLAR WHERE EMIRLER.KODU = KODU) AS ADI FROM EMIRLER WHERE EMIRNO = @EMIRNO AND TIP = 1 AND CINS = 3 ",
                param : ['EMIRNO'],
                type : ['int'],
                value : [$scope.SipEmirNo]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                $scope.SiparisListesi = Data
                SipListeGrid(Data)
            });
    }
    $scope.BtnTemizle = function()
    {
        $scope.Barkod = ''
    } 
    $scope.BtnRafTemizle = function()
    {
        $scope.RafOkut = ''
    }

}