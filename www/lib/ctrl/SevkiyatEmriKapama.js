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
        $scope.SipEmirno = SiparisSelectedRow.Item.EMIRNO;
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
    function Insert()
    {

        let InsertData =
        [
            UserParam.Kullanici,
            UserParam.Kullanici,
            1,
            3,
            $scope.Tarih,
            $scope.Seri,
            $scope.Sira,
            $scope.Stokkodu,
            '',
            $scope.GirisSube,
            $scope.DepoNo,
            $scope.Birim,
            $scope.Miktar,
            '',
            $scope.SipStokUid,
        ];
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
                    InsertAfterRefesh()
                });
            }
        });  
    

    }
    InsertAfterRefesh = function()
    {
        $scope.Barkod = ''
        $scope.Miktar = 1
        $scope.StokAdi = ''
        $scope.BekleyenMiktar = ''
        $scope.Urun = ''
        $scope.Raf = ''
        $scope.Sube = ''
        $scope.SipStokUid = ''
        $scope.SipStokKodu = ''
        $scope.Birim = ''
        $scope.BirimAdi = ''
        $scope.Katsayi = ''
        $scope.PaletRafKodu = ''
        $scope.BtnSipSec()
        $window.document.getElementById("Barkod").focus();
        $window.document.getElementById("Barkod").select();
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
        $scope.PaletRafKodu = ''
        $scope.DepoNo = 1
        $scope.MainClick();
        db.MaxSira($scope.Firma,'EmirlerMaxSira',[$scope.Seri,1,3],function(data)
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
        console.log(1)
        db.GetData($scope.Firma,'SevkiyatEmriGetir',[1,3,$scope.SipEmirno],function(data)
        {console.log(2)
            $scope.SiparisStok = data;
            if($scope.SiparisStok == '')
            {
                alertify.alert("<a style='color:#3e8ef7''>" + "Emir Kapanmıştır !" + "</a>" );          
                console.log("Stok Bulunamamıştır.");
                $scope.SipListesi();
            }
            else
            {
                console.log($scope.SiparisStok)
                $scope.Urun = $scope.SiparisStok[0].STOKADI;
                $scope.Raf = $scope.SiparisStok[0].RAFKODU;
                $scope.Sube = $scope.SiparisStok[0].SUBEADI;
                $scope.SipStokUid = $scope.SiparisStok[0].EMIRUID;
                $scope.SipStokKodu = $scope.SiparisStok[0].STOKKOD;
                $scope.GirisSube = $scope.SiparisStok[0].GIRISSUBE
                $scope.Birim = $scope.SiparisStok[0].BIRIM
                $scope.BirimAdi = $scope.SiparisStok[0].BIRIMADI
                $scope.Katsayi = $scope.SiparisStok[0].KATSAYI

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
                query:  "SELECT KODU,MIKTAR,TESLIM_MIKTAR AS TESLIM,(SELECT ADI FROM STOKLAR WHERE EMIRLER.KODU = KODU) AS ADI FROM EMIRLER WHERE EMIRNO = @EMIRNO AND TIP = 1 AND CINS = 3  ",
                param : ['EMIRNO'],
                type : ['int'],
                value : [$scope.SipEmirno]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                console.log(Data)
                SipListeGrid(Data)
            });
    }
    $scope.BtnTemizle = function()
    {
        $scope.Barkod = ''
    }
}