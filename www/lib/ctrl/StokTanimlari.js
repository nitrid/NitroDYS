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
            pageSize: 10,
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
    function TblBirimInit(pData)
    {
        $("#TblBirim").jsGrid
        ({
            width: "100%",
            updateOnResize: true,
            heading: true,
            selecting: true,
            data : pData,
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
                    $scope.StokListe[0].ADI
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
}