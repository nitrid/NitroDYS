function PersonelTanimlari ($scope,$window,db)
{
    let SecimSelectedRow = null;

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
            filtering: true,
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
    function SecimListeRowClick(pIndex,pItem,pObj)
    {    
        if ( SecimSelectedRow ) { SecimSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        SecimSelectedRow = $row;
        SecimSelectedRow.Item = pItem
        SecimSelectedRow.Index = pIndex
    }
    function Getir(pKodu)
    {
        $scope.DataListe = [];
        console.log($scope.DataListe)
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT KODU,ADI,TIP FROM PERSONEL WHERE KODU = @KODU",
            param : ['KODU'],
            type : ['string|25'],
            value : [pKodu]
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            $scope.DataListe = Data;
            console.log($scope.DataListe[0].TIP)
            
        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
    
        TblSecimInit([]);

        document.getElementById("page-title").innerHTML = "Raf Kategori Tanımları";
        document.getElementById("page-path").innerHTML = "Raf Kategori Tanımları";

        $scope.DataListe = 
        [
            {
                KODU : "",
                ADI : ""
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
                    $scope.DataListe[0].ADI,
                    $scope.DataListe[0].TIP
                ];
                
                db.ExecuteTag($scope.Firma,'PersonelTanimlariKaydet',InsertData,function(InsertResult)
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
                db.ExecuteTag($scope.Firma,'RafKategoriTanimlariSil',[$scope.DataListe[0].KODU],function(data)
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
        Getir(SecimSelectedRow.Item.KODU);
        $("#MdlSecim").modal('hide');
    }
    $scope.BtnSecimGrid = function()
    {
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT KODU,ADI,TIP FROM PERSONEL"
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            TblSecimInit(Data);
            $('#MdlSecim').modal('show');
        });
    }
}