function RafTanimlari ($scope,$window,db)
{
    let SecimSelectedRow = null;
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
    function SecimListeRowClick(pIndex,pItem,pObj)
    {    
        if ( SecimSelectedRow ) { SecimSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        SecimSelectedRow = $row;
        SecimSelectedRow.Item = pItem
        SecimSelectedRow.Index = pIndex
    }
    function RafGetir(pKodu,pKat)
    {
        $scope.DataListe = [];
        db.GetData($scope.Firma,'RafTanimlariGetir',[pKodu,pKat],function(Data)
        {
            $scope.DataListe = Data;
        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
    
        TblSecimInit([]);

        document.getElementById("page-title").innerHTML = "Raf Tanımları";
        document.getElementById("page-path").innerHTML = "Raf Tanımları";

        $scope.DataListe = 
        [
            {
                KODU : "",
                TIP : "0",
                STOK : "",
                KAT : "0",
                SIRA : 1,
                KATEGORI : "",
                EN : "",
                BOY : "",
                YUKSEKLIK : ""
            }
        ];

        
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
                    $scope.DataListe[0].TIP,
                    $scope.DataListe[0].STOK,
                    $scope.DataListe[0].KAT,
                    $scope.DataListe[0].SIRA,
                    $scope.DataListe[0].EN,
                    $scope.DataListe[0].BOY,
                    $scope.DataListe[0].YUKSEKLIK,                    
                    $scope.DataListe[0].KATEGORI
                ];
                
                db.ExecuteTag($scope.Firma,'RafTanimlariKaydet',InsertData,function(InsertResult)
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
            if($scope.DataListe[0].KODU != '')
            {
                db.ExecuteTag($scope.Firma,'RafTanimlariSil',[$scope.DataListe[0].KODU,$scope.DataListe[0].KAT],function(data)
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
        if(ModalTip == "Raf")
        {
            RafGetir(SecimSelectedRow.Item.KODU,SecimSelectedRow.Item.KAT);
            $("#MdlSecim").modal('hide');
        }
        else if(ModalTip == "Kategori")
        {
            $scope.DataListe[0].KATEGORI = SecimSelectedRow.Item.KODU;
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

        if(ModalTip == "Raf")
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,STOK,KAT,SIRA FROM RAFLAR"
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
                query:  "SELECT KODU,ADI FROM RAF_KATEGORI"
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