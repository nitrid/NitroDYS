function SubeEmirKapatma ($scope,$window,db)
{

    
    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.Seri = ''
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");
        let TmpQuery = 
        {
            db : $scope.Firma,
            query:  "SELECT KODU,KAT,SIRA FROM RAFLAR"
        }
        db.GetDataQuery(TmpQuery,function(Data)
        {
            TblSecimInit(Data);
            $('#MdlSecim').modal('show');
        });
    }

}