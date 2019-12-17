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
                TmpColumns.push({name : item});
            });    
        }
        
        $("#TblSecim").jsGrid
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
            fields: TmpColumns,
            rowClick: function(args)
            {
                SecimListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }
        });
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
                {
                    name: "STOK",
                    title: "STOK",
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
            $scope.EtiketListe = Data;
            TblEtiketInit(Data);
        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
    
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
                SERI : "",
                SIRA : 1,
                PALET : "",
                STOK : "",
                MIKTAR : ""
            }
        ]

        $scope.EtiketSeri = UserParam.Etiket.Seri;
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
                let InsertData =
                [
                    UserParam.Kullanici,
                    UserParam.Kullanici,
                    $scope.DataListe[0].KODU,
                    $scope.DataListe[0].STOK,
                    $scope.DataListe[0].TIP,
                    $scope.DataListe[0].SKT,
                    $scope.DataListe[0].MIKTAR
                ];
                
                db.ExecuteTag($scope.Firma,'PaletTanimlariKaydet',InsertData,function(InsertResult)
                { 
                    if(typeof(InsertResult.result.err) == 'undefined')
                    {                          
                        alertify.confirm('Dikkat !','Etiket olarak eklemek istermisiniz ?', function()
                        {
                            let InsertData =
                            [
                                UserParam.Kullanici,
                                UserParam.Kullanici,
                                $scope.EtiketSeri,
                                $scope.EtiketSira,
                                $scope.DataListe[0].KODU,
                                $scope.DataListe[0].STOK,
                                "",
                                "",
                                1,
                                1
                            ];
                            db.ExecuteTag($scope.Firma,'EtiketKaydet',InsertData,function(Result)
                            { 
                                EtiketGetir();
                                $scope.Yenile();
                            });
                        },
                        function()
                        {
                            $scope.Yenile();
                        });
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
                query:  "SELECT KODU,STOK,SKT FROM PALETLER"
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
                query:  "SELECT KODU,ADI FROM STOKLAR"
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
    }
}