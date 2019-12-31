function SubeEmirKapatma ($scope,$window,db)
{

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
                    name: "TIP",
                    title: "TIP",
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

        });
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.Seri = ''
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");
        $scope.SipTarih = moment(new Date()).format("DD.MM.YYYY");
        $scope.SipTarih2 = moment(new Date()).format("DD.MM.YYYY");
        $scope.MainClick();
        TblSiparisSecimGrid()
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT KODU,KAT,SIRA FROM RAFLAR"
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {

        });
    }
    $scope.Insert = function()
    {
        $("#TbBelgeBilgisi").addClass('active');
        $("#TbMain").removeClass('active');
    }
    $scope.MainClick = function() 
    {
        $("#TbBelgeBilgisi").addClass('active');
        $("#TbMain").removeClass('active');
    }



}