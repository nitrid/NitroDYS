function PaletAdresleme ($scope,$window,db)
{
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
                EtiketListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }
        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
    
        TblArdesGrid();

        $scope.EtiketSeri = UserParam.Etiket.Seri;
    }

}