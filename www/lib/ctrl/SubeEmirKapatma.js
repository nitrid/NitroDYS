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
                    name: "SERI",
                    title: "SERI",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "SIRA",
                    title: "SIRA",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "SUBE",
                    title: "SUBE",
                    type: "text",
                    align: "center",
                    width: 150
                },
            ],

        });
    }
    function SiparisListele()
    {
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT SERI AS SERI,SIRA AS SIRA,CIKIS AS SUBE FROM EMIRLER WHERE TIP = 1 AND CINS = 1 AND TARIH >= @ILKTARIH AND TARIH <= @SONTARIH",
                param: ['ILKTARIH','SONTARIH'],
                type: ['date','date'],
                value:[$scope.SipTarih,$scope.SipTarih2]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                TblSiparisSecimGrid(Data);
                $('#MdlSecim').modal('show');
            });
        }
        console.log($scope.SipTarih)
    }
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.Seri = ''
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");
        $scope.SipTarih =   new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.SipTarih2 =  new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.MainClick();


        SiparisListele()
        TblSiparisSecimGrid()
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
    $scope.BtnSipListele = function()
    {
        SiparisListele()
    }


}