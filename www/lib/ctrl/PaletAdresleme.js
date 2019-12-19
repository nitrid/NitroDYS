function PaletAdresleme ($scope,$window,db)
{
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
    function TblArdesGrid(pData)
    {                
        $("#TblAdres").jsGrid
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
                    name: "RAF",
                    title: "RAF",
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
                AdresListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }
        });
    }
    function AdresListeRowClick(pIndex,pItem,pObj)
    {    
        if ( AdresSelectedRow ) { AdresSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        AdresSelectedRow = $row;
        AdresSelectedRow.Item = pItem
        AdresSelectedRow.Index = pIndex
    }
    function AdresGetir(pKodu)
    {
        $scope.DataListe = [];
        db.GetData($scope.Firma,'',[pKodu],function(Data)
        {
            $scope.DataListe = Data;
        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
    
        
        TblArdesGrid();

        $scope.AdresSeri = UserParam.Adres.Seri;
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
        else if(ModalTip == "RAF")
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT KODU,ADI FROM RAFLAR"
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSecimInit(Data);
                $('#MdlSecim').modal('show');
            });
        }
    }

}