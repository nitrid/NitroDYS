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
                TmpColumns.push({name : item,type: "text"});
            });    
        }
        
        let db = {
            loadData: function(filter) 
            {
                return $.grep(pData, function(client) 
                { 
                    return (!filter.KODU || client.KODU.indexOf(filter.KODU) > -1)
                        && (!filter.STOK || client.STOK.indexOf(filter.STOK) > -1)
                        && (!filter.ADI || client.ADI.indexOf(filter.ADI) > -1)
                        && (!filter.KAT || client.KAT === filter.KAT)
                        && (filter.Married === undefined || client.Married === filter.Married);
                });
            }
        };

        $("#TblSecim").jsGrid
        ({
           
            width: "100%",
            updateOnResize: true,
            heading: true,
            filtering: true,
            editing: true,
            sorting: true,
            paging: true,
            autoload: true,
            data : pData,
            pageSize: 10,
            pageButtonCount: 3,
            pagerFormat: "{pages} {next} {last}    {pageIndex} of {pageCount}",
            fields: TmpColumns,

            controller:db,

            rowClick: function(args)
            {
                SecimListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }
        });
        $("#TblSecim").jsGrid("search");
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
    function RafGetir(pKodu)
    {
        $scope.DataListe = [];
        db.GetData($scope.Firma,'RafTanimlariGetir',[pKodu],function(Data)
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
                    0,
                    0,
                    0,                    
                    $scope.DataListe[0].KATEGORI,
                    0
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
    $scope.RafTanimGetir = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            RafGetir($scope.DataListe[0].KODU);
        }
    }
}