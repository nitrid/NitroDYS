function SubeEmirKapatma ($scope,$window,db)
{
    let SiparisSelectedRow = null;
    
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
            rowClick: function(args)
            {
                SiparisListeRowClick(args.itemIndex,args.item,this);
                $scope.$apply();
            }

        });
    }
    function SiparisListele()
    {
        {
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT SERI AS SERI,SIRA AS SIRA,CIKIS AS SUBE,TIP,CINS FROM EMIRLER WHERE TIP = 1 AND CINS = 0 AND TARIH>=@ILKTARIH AND TARIH<=@SONTARIH GROUP BY SERI,SIRA,CIKIS,TIP,CINS",
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
    }
    function SiparisListeRowClick(pIndex,pItem,pObj)
    {    
        if ( SiparisSelectedRow ) { SiparisSelectedRow.children('.jsgrid-cell').css('background-color', '').css('color',''); }
        var $row = pObj.rowByItem(pItem);
        $row.children('.jsgrid-cell').css('background-color','#2979FF').css('color','white');
        SiparisSelectedRow = $row;
        SiparisSelectedRow.Item = pItem
        SiparisSelectedRow.Index = pIndex
    }
    function StokBarkodGetir(pBarkod)
    {
        db.StokBarkodGetir($scope.Firma,pBarkod,$scope.CDepo,async function(BarkodData)
        {  
            $scope.BarkodData = BarkodData
            console.log($scope.BarkodData)
            $scope.StokAdi = $scope.BarkodData[0].STOKADI 
            $scope.Katsayi = $scope.BarkodData[0].KATSAYI
            $scope.Stokkodu = $scope.BarkodData[0].STOK
            $scope.Miktar = 1;
            $scope.BirimAdi = $scope.BarkodData[0].BIRIMADI
            let TmpQuery = 
            {
                db : $scope.Firma,
                query:  "SELECT (MIKTAR - TESLIM_MIKTAR) AS BEKLEYEN FROM EMIRLER WHERE UID = @UID",
                param: ['UID'],
                type: ['string|50'],
                value:[$scope.SipStokUid]
            }
            db.GetDataQuery(TmpQuery,function(Data)
            {
                $scope.BekleyenMiktar = Data[0].BEKLEYEN 
            });

        });
    }

    $scope.Init = function()
    {
        $scope.Firma = "NTGDB";
        $scope.User = $window.sessionStorage.getItem('User');
        UserParam = Param[$window.sessionStorage.getItem('User')];
        $scope.Seri = 'B'
        $scope.Urun = ''
        $scope.Tarih = moment(new Date()).format("DD.MM.YYYY");
        $scope.SipTarih =   new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.SipTarih2 =  new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' });
        $scope.MainClick();
        db.MaxSira($scope.Firma,'EmirlerMaxSira',[$scope.Seri,1],function(data)
        {
            $scope.Sira = data
        });


        SiparisListele()
        TblSiparisSecimGrid()
    }
    $scope.Insert = function()
    {

    }
    $scope.MainClick = function() 
    {
        $("#TbSiparisSecim").addClass('active');
        $("#TbSiparisGiris").removeClass('active');
    }
    $scope.BtnSipListele = function()
    {
        SiparisListele()
    }
    $scope.BtnSipSec = function()
    {
        $scope.SipSeri = SiparisSelectedRow.Item.SERI;
        $scope.SipSira = SiparisSelectedRow.Item.SIRA;
        db.GetData($scope.Firma,'SubeEmriGetir',[$scope.SipSeri,$scope.SipSira,1,0],function(data)
        {
            $scope.SiparisStok = data;
            $scope.Urun = $scope.SiparisStok[0].STOKADI;
            $scope.Raf = $scope.SiparisStok[0].RAFKODU;
            $scope.Kat = $scope.SiparisStok[0].RAFKATI;
            $scope.Sube = $scope.SiparisStok[0].SUBEADI;
            $scope.SipStokUid = $scope.SiparisStok[0].UID

            $("#TbSiparisGiris").addClass('active');
            $("#TbSiparisSecim").removeClass('active');
        });
    }
    $scope.BtnStokBarkodGetir = function(keyEvent)
    {
        if(keyEvent.which === 13)
        {
            StokBarkodGetir($scope.Barkod);    
        }
    }
}