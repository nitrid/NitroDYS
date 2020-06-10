function PaletTanimlari ($scope,$window,db)
{
    let SecimSelectedRow = null;
    let EtiketSelectedRow = null;
    let ModalTip = "";

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
                        && (!filter.ADI || client.ADI.indexOf(filter.ADI) > -1)
                        && (!filter.STOK || client.STOK.indexOf(filter.STOK) > -1)
                        && (!filter.BARKOD || client.BARKOD.indexOf(filter.BARKOD) > -1)
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
            controller:db,
        });
        $("#TblSecim").jsGrid("search");
    }
    function TblEtiketInit(pData)
    {                
        $("#TblEtiket").jsGrid
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
            ],
            rowClick: function(args)
            {
                EtiketListeRowClick(args.itemIndex,args.item,this);
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
    function EtiketListeRowClick(pIndex,pItem,pObj)
    {    
        if ( EtiketSelectedRow ) { EtiketSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        EtiketSelectedRow = $row;
        EtiketSelectedRow.Item = pItem
        EtiketSelectedRow.Index = pIndex
    }
    function PaletGetir(pKodu)
    {
        $scope.DataListe = [];
        db.GetData($scope.Firma,'PaletTanimlariGetir',[pKodu],function(Data)
        {
            $scope.DataListe = Data;
        });
    }
    function EtiketGetir()
    {
        $scope.EtiketListe = [];
        db.GetData($scope.Firma,'EtiketGetir',[$scope.EtiketSeri,$scope.EtiketSira],function(Data)
        {
            console.log(Data)
            $scope.EtiketListe = Data;
            TblEtiketInit(Data);
        });
    }
    function MaxEtiketSira()
    {
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT ISNULL(MAX(SIRA),0) + 1 AS SIRA FROM ETIKET WHERE SERI = @SERI",
            param : ['SERI'],
            type : ['string|10'],
            value : [$scope.EtiketSeri]
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            $scope.EtiketSira = Data[0].SIRA;
        });
    }
    function Kaydet(pCallback)
    { 
        let InsertEtiket =
        [
            UserParam.Kullanici,
            UserParam.Kullanici,
            $scope.EtiketSeri,
            $scope.EtiketSira,
            moment(new Date()).format("DD.MM.YYYY"),
            '',
            $scope.DataListe[0].KODU,
            '',
            "",
            "",
            1,
            2,
        ];
        console.log(InsertEtiket)
        db.ExecuteTag($scope.Firma,'EtiketKaydet',InsertEtiket,function(Result)
        { 
            pCallback(true);
        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $('side-menu').hide()
    
        TblSecimInit([]);
        TblEtiketInit([]);

        document.getElementById("page-title").innerHTML = "Palet Tanımları";
        document.getElementById("page-path").innerHTML = "Palet Tanımları";

        $scope.DataListe = 
        [
            {
                KODU : "",
                TIP : "0",
                STOK : "",
                SKT : moment(new Date()).format("DD.MM.YYYY"),
                MIKTAR : "0"
            }
        ];

        $scope.EtiketListe =
        [
            {
                TARIH : moment(new Date()).format("DD.MM.YYYY"),
                PALET : "",
                STOK : "",
                MIKTAR : ""
            }
        ]

        $scope.EtiketSeri = UserParam.Etiket.Seri;
        $scope.OtoPaletAdet = 1;

        MaxEtiketSira();
    }
    $scope.Yenile = function()
    {
        TblSecimInit([]);

        $scope.DataListe = 
        [
            {
                KODU : "",
                TIP : "0",
                STOK : "",
                SKT : moment(new Date()).format("DD.MM.YYYY"),
                MIKTAR : "0"
            }
        ];
    }
    $scope.BtnGetirKey = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            console.log( $scope.DataListe[0].STOK)
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT STOKLAR.KODU AS KODU,STOKLAR.ADI AS ADI , BARKODLAR.KODU AS BARKOD FROM STOKLAR INNER JOIN   BARKODLAR ON STOKLAR.KODU = BARKODLAR.STOK WHERE BARKODLAR.KODU = @BARKOD ",
                param: ['BARKOD:string|25'],
                value: [$scope.DataListe[0].STOK]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                if(Data.length > 0)
                {
                    $scope.DataListe[0].STOK = Data[0].KODU
                }
                else
                {
                    alertify.alert("Barkod Sistemde bulunamadı !");
                    $scope.DataListe[0].STOK = ''
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

        $scope.DataListe[0].KODU = KulStr + TarihStr + AutoStr;
    }
    $scope.BtnKaydet = function()
    {
        alertify.confirm('Dikkat !','Kayıt etmek istediğinize eminmisiniz ?', 
        function()
        { 
            if($scope.DataListe[0].KODU != '')
            {
                Kaydet(function(pStatus)
                {
                    if(pStatus)
                    {
                        EtiketGetir();
                        $scope.Yenile();
                    }
                });
            }
            else
            {
                alertify.okBtn("Tamam");
                alertify.alert("Kodu bölümünü boş geçemezsiniz !");
            }
        }
        ,function(){}).set('labels',{ok: 'Evet',cancel: 'Hayır'});
    }
    $scope.BtnSil = function()
    {
        alertify.confirm('Dikkat !','Silmek istediğinize eminmisiniz ?', 
        function()
        { 
            if($scope.DataListe[0].KODU != '')
            {
                db.ExecuteTag($scope.Firma,'PaletTanimlariSil',[$scope.DataListe[0].KODU],function(data)
                {
                    $scope.Init();
                });
            }
            else
            {
                alertify.okBtn("Tamam");
                alertify.alert("Seçili kayıt olmadan silemezsiniz !");
            }
        }
        ,function(){}).set('labels',{ok: 'Evet',cancel: 'Hayır'});
    }
    $scope.BtnGridSec = function()
    {
        if(ModalTip == "Palet")
        {
            PaletGetir(SecimSelectedRow.Item.KODU);
            $("#MdlSecim").modal('hide');
        }
        else if(ModalTip == "Stok")
        {
            $scope.DataListe[0].STOK = SecimSelectedRow.Item.KODU;
            $("#MdlSecim").modal('hide');
        }
        else if(ModalTip == "Etiket")
        {
            $scope.EtiketSeri = SecimSelectedRow.Item.SERI;
            $scope.EtiketSira = SecimSelectedRow.Item.SIRA;

            EtiketGetir();

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
                query:  "SELECT KODU,PARTI,MIKTAR FROM PALETLER"
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
        else if(ModalTip == "Stok")
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,ADI,(SELECT TOP 1 KODU FROM BARKODLAR WHERE STOK = STOKLAR.KODU) AS BARKOD FROM STOKLAR"
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
        else if(ModalTip == "Etiket")
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT FORMAT(TARIH,'dd.MM.yyyy') AS TARIH,SERI,SIRA FROM ETIKET GROUP BY SERI,SIRA,TARIH"
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
    }
    $scope.BtnSeciliEtiket = function()
    {
        alertify.confirm('Dikkat !','Seçili etiketi yazdırmak istediğinize eminmisiniz ?', function()
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "UPDATE ETIKET SET DURUM = 1 WHERE PALET = @PARTI",
                param : ['PARTI'],
                type : ['string|15'],
                value : [EtiketSelectedRow.Item.PALET]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                EtiketGetir();
            });
        },
        function(){});
    }
    $scope.BtnTumEtiket = function()
    {
        alertify.confirm('Dikkat !','Tüm etiket listesini yazdırmak istediğinize eminmisiniz ?', function()
        {
            $scope.EtiketListe.forEach(item => 
            {
                let TmpQuery = 
                {
                    db : $scope.Firma,
                    query:  "UPDATE ETIKET SET DURUM = 1 WHERE PALET = @PARTI",
                    param : ['PARTI'],
                    type : ['string|15'],
                    value : [item.PALET]
                }
                db.GetDataQuery(TmpQuery,function(Data)
                {
                });
            });
            
        },
        function(){});
    }
    $scope.BtnAuto = function()
    {
        let TmpKodu = $scope.DataListe[0].KODU;

        alertify.confirm('Dikkat !','Toplu palet oluşturmak istediğinize eminmisiniz ?', function()
        {
            for(let i = 0;i < $scope.OtoPaletAdet;i++)
            {
                $scope.DataListe[0].KODU = TmpKodu;
                $scope.BtnPaletGenerate();

                Kaydet(function(pStatus)
                {
                    if(pStatus)
                    {
                        EtiketGetir();
                        $scope.Yenile();
                    }
                });
            }
            $("#MdlOtoPalet").modal('hide');
        },
        function(){});
    }
}