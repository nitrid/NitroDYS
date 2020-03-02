function StokTanimlari ($scope,$window,db)
{
    let SecimSelectedRow = null;
    let BirimSelectedRow = null;
    let BarkodSelectedRow = null;
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
            pageSize: 10,
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
    function TblBirimInit(pData)
    {
        console.log(pData);
        $("#TblBirim").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : pData,
            fields:
            [
                {
                    name: "TIP",
                    title : "TIP",
                    type : "text",
                    align: "center",
                    width: 100                    
                },
                {
                    name: "KODU",
                    title : "KODU",
                    type : "text",
                    align: "center",
                    width: 100                    
                },
                {
                    name: "ADI",
                    title : "ADI",
                    type : "text",
                    align: "center",
                    width: 100                    
                },
                {
                    name: "KATSAYI",
                    title : "KATSAYI",
                    type : "text",
                    align: "center",
                    width: 100                    
                }
            ],
            paging : true,
            pageSize: 10,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            rowClick: function(args)
            {
                BirimListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }
        });
    }
    function TblBarkodInit(pData)
    {
        $("#TblBarkod").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : pData,
            fields:
            [
                {
                    name: "BARKOD",
                    title : "BARKOD",
                    type : "text",
                    align: "center",
                    width: 100                    
                },
                {
                    name: "BIRIM",
                    title : "BIRIM",
                    type : "text",
                    align: "center",
                    width: 100                    
                }
            ],
            paging : true,
            pageSize: 10,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            rowClick: function(args)
            {
                BarkodListeRowClick(args.itemIndex,args.item,this);
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
    function BirimListeRowClick(pIndex,pItem,pObj)
    {    
        if ( BirimSelectedRow ) { BirimSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        BirimSelectedRow = $row;
        BirimSelectedRow.Item = pItem
        BirimSelectedRow.Index = pIndex
    }
    function BarkodListeRowClick(pIndex,pItem,pObj)
    {    
        if ( BarkodSelectedRow ) { BarkodSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        BarkodSelectedRow = $row;
        BarkodSelectedRow.Item = pItem
        BarkodSelectedRow.Index = pIndex
    }
    function StokGetir(pKodu)
    {
        $scope.StokListe = [];
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT KODU,ADI FROM STOKLAR WHERE KODU = @KODU",
            param: ['KODU:string|25'],
            value: [pKodu]
        }

        db.GetDataQuery(TmpQuery,function(Data)
        {
            $scope.StokListe = Data;
            //BİRİM LİSTESİ GETİR
            TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT CASE WHEN TIP = 0 THEN 'Ana Birim' ELSE 'Alt Birim' END AS TIP,KODU,ADI,KATSAYI FROM BIRIMLER WHERE STOK = @STOK",
                param: ['STOK:string|25'],
                value: [pKodu]
            } 
            db.GetDataQuery(TmpQuery,function(Data)
            {
                $scope.BirimListe = Data;
                TblBirimInit($scope.BirimListe);
            });
            //BARKOD LİSTESİ GETİR
            TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU AS BARKOD, ISNULL((SELECT ADI FROM BIRIMLER WHERE BIRIMLER.STOK = BARKODLAR.STOK AND BIRIMLER.KODU = BARKODLAR.BIRIM),'') AS BIRIM FROM BARKODLAR WHERE STOK = @STOK",
                param: ['STOK:string|25'],
                value: [pKodu]
            } 
            db.GetDataQuery(TmpQuery,function(Data)
            {
                $scope.BarkodListe = Data;
                TblBarkodInit($scope.BarkodListe);
            });

        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
    
        $scope.StokListe = [];
        $scope.BirimListe = [];
        $scope.BarkodListe = [];

        TblSecimInit([]);
        TblBirimInit([]);
        TblBarkodInit([]);

        document.getElementById("page-title").innerHTML = "Stok Tanımları";
        document.getElementById("page-path").innerHTML = "Stok Tanımları";

        $scope.StokListe = 
        [
            {
                KODU : "",
                ADI : ""
            }
        ];

        $scope.BirimModal = {};
        $scope.BirimModal.Tip = "0";
        $scope.BirimModal.Kodu = "";
        $scope.BirimModal.Adi = "";
        $scope.BirimModal.Katsayi = 0;

        $scope.BarkodModal = {};
        $scope.BarkodModal.Birim = "";
        $scope.BarkodModal.Barkod = "";
    }
    $scope.BtnKaydet = function()
    {
        alertify.confirm('Dikkat !','Kayıt etmek istediğinize eminmisiniz ?', 
        function()
        { 
            if($scope.StokListe[0].KODU != '')
            {
                let InsertData =
                [
                    UserParam.Kullanici,
                    UserParam.Kullanici,
                    $scope.StokListe[0].KODU,
                    $scope.StokListe[0].ADI,
                    $scope.StokListe[0].KATEGORI,
                ];
                
                db.ExecuteTag($scope.Firma,'StokTanimlariKaydet',InsertData,function(InsertResult)
                { 
                    if(typeof(InsertResult.result.err) == 'undefined')
                    {  
                        $scope.Init();
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
            if($scope.StokListe[0].KODU != '')
            {
                db.ExecuteTag($scope.Firma,'StokTanimlariSil',[$scope.StokListe[0].KODU],function(data)
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
        if(ModalTip == "Stok")
        {
            StokGetir(SecimSelectedRow.Item.KODU,SecimSelectedRow.Item.KAT);
            $("#MdlSecim").modal('hide');
        }
        else if(ModalTip == "Kategori")
        {
            $scope.StokListe[0].KATEGORI = SecimSelectedRow.Item.KODU
            $("#MdlSecim").modal('hide');
        }

        ModalTip = "";
    }
    $scope.BtnSecimGrid = function(pTip)
    {
        ModalTip = pTip;

        if(ModalTip == "Stok")
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
        else if(ModalTip == "Kategori")
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT ADI,KODU FROM RAF_KATEGORI"
            } 
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
    }
    $scope.BtnTabBirim = function()
    {
        $("#TabBirim").addClass('active');
        $("#TabBarkod").removeClass('active');
    }
    $scope.BtnTabBarkod = function()
    {
        $("#TabBarkod").addClass('active');
        $("#TabBirim").removeClass('active');
    }
    $scope.BtnYeniBirim = function()
    {
        $('#MdlBirim').modal('show');
    }
    $scope.BtnYeniBarkod = function()
    {
        $('#MdlBarkod').modal('show');
    }
    $scope.BtnBirimKaydet = function()
    {
        alertify.confirm('Dikkat !','Kayıt etmek istediğinize eminmisiniz ?', 
        function()
        { 
            if($scope.StokListe[0].KODU != '')
            {
                let InsertData =
                [
                    UserParam.Kullanici,
                    UserParam.Kullanici,
                    $scope.BirimModal.Tip,
                    $scope.StokListe[0].KODU,
                    $scope.BirimModal.Kodu,
                    $scope.BirimModal.Adi,
                    $scope.BirimModal.Katsayi
                ];
                
                db.ExecuteTag($scope.Firma,'BirimTanimlariKaydet',InsertData,function(InsertResult)
                { 
                    if(typeof(InsertResult.result.err) == 'undefined')
                    {  
                        let TmpQuery = 
                        {
                            db : $scope.Firma,
                            query:  "SELECT CASE WHEN TIP = 0 THEN 'Ana Birim' ELSE 'Alt Birim' END AS TIP,KODU,ADI,KATSAYI FROM BIRIMLER WHERE STOK = @STOK",
                            param: ['STOK:string|25'],
                            value: [$scope.StokListe[0].KODU]
                        } 
                        db.GetDataQuery(TmpQuery,function(Data)
                        {
                            $scope.BirimListe = Data;
                            TblBirimInit($scope.BirimListe);
                        });
                    }

                    $('#MdlBirim').modal('hide');
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
    $scope.BtnBarkodKaydet = function()
    {
        alertify.confirm('Dikkat !','Kayıt etmek istediğinize eminmisiniz ?', 
        function()
        { 
            if($scope.StokListe[0].KODU != '')
            {
                let InsertData =
                [
                    UserParam.Kullanici,
                    UserParam.Kullanici,
                    $scope.BarkodModal.Barkod,
                    $scope.StokListe[0].KODU,
                    $scope.BarkodModal.Birim
                ];
                
                db.ExecuteTag($scope.Firma,'BarkodTanimlariKaydet',InsertData,function(InsertResult)
                { 
                    if(typeof(InsertResult.result.err) == 'undefined')
                    {  
                        let TmpQuery = 
                        {
                            db : $scope.Firma,
                            query:  "SELECT KODU AS BARKOD, ISNULL((SELECT ADI FROM BIRIMLER WHERE BIRIMLER.STOK = BARKODLAR.STOK AND BIRIMLER.KODU = BARKODLAR.BIRIM),'') AS BIRIM FROM BARKODLAR WHERE STOK = @STOK",
                            param: ['STOK:string|25'],
                            value: [$scope.StokListe[0].KODU]
                        } 
                        db.GetDataQuery(TmpQuery,function(Data)
                        {
                            $scope.BarkodListe = Data;
                            TblBarkodInit($scope.BarkodListe);
                        });
                    }

                    $('#MdlBarkod').modal('hide');
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
}