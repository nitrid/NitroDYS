var QuerySql = 
{
    RafTanimlariKaydet : 
    {
        query : "DECLARE @TMPCODE NVARCHAR(25) " +
                "SET @TMPCODE = ISNULL((SELECT KODU FROM RAFLAR WHERE KODU = @KODU AND KAT = @KAT),'') " +
                "IF @TMPCODE = '' " +
                "INSERT INTO [dbo].[RAFLAR] " + 
                "([OKULLANICI] " + 
                ",[DKULLANICI] " + 
                ",[OTARIH] " + 
                ",[DTARIH] " + 
                ",[KODU] " + 
                ",[TIP] " + 
                ",[KAT] " + 
                ",[SIRA] " + 
                ",[EN] " + 
                ",[BOY] " + 
                ",[YUKSEKLIK] " + 
                ",[KATEGORI] " + 
                ",[MIKTAR]) " + 
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@KODU			    --<KODU, nvarchar(25),> \n" +
                ",@TIP			    --<TIP, smallint,> \n" +
                ",@KAT			    --<KAT, smallint,> \n" +
                ",@SIRA			    --<SIRA, int,> \n" +
                ",@EN				--<EN, int,> \n" +
                ",@BOY			    --<BOY, int,> \n" +
                ",@YUKSEKLIK		--<YUKSEKLIK, int,> \n" +
                ",@KATEGORI		    --<KATEGORI, nvarchar(25),> \n" +
                ",@MIKTAR		    --<MIKTAR, nvarchar(25),> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[RAFLAR] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[TIP] = @TIP " +
                ",[SIRA] = @SIRA " +
                ",[EN] = @EN " +
                ",[BOY] = @BOY " +
                ",[YUKSEKLIK] = @YUKSEKLIK " +
                ",[KATEGORI] = @KATEGORI " +
                "WHERE [KODU] = @TMPCODE AND [KAT] = @KAT",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','KODU:string|25','TIP:int','KAT:int','SIRA:int','EN:int','BOY:int','YUKSEKLIK:int','KATEGORI:string|25','MIKTAR:float']
    },
    RafTanimlariGetir : 
    {
        query : "SELECT KODU AS KODU,CONVERT(NVARCHAR(10),TIP) AS TIP,CONVERT(NVARCHAR(10),KAT) AS KAT,SIRA AS SIRA,EN AS EN,BOY AS BOY,YUKSEKLIK AS YUKSEKLIK,KATEGORI AS KATEGORI FROM RAFLAR WHERE KODU = @KODU",
        param : ['KODU'],
        type : ['string|25']
    },
    RafTanimlariSil :
    {
        query : "DELETE FROM RAFLAR WHERE KODU = @KODU AND KAT = @KAT",
        param : ['KODU:string|25','KAT:int']
    },
    RafKategoriTanimlariKaydet : 
    {
        query : "DECLARE @TMPCODE NVARCHAR(25) " +
                "SET @TMPCODE = ISNULL((SELECT KODU FROM RAF_KATEGORI WHERE KODU = @KODU),'') " +
                "IF @TMPCODE = '' " +
                "INSERT INTO [dbo].[RAF_KATEGORI] " + 
                "([OKULLANICI] " + 
                ",[DKULLANICI] " + 
                ",[OTARIH] " + 
                ",[DTARIH] " + 
                ",[KODU] " + 
                ",[ADI]) " + 
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@KODU			    --<KODU, nvarchar(25),> \n" +
                ",@ADI			    --<ADI, nvarchar(50),> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[RAF_KATEGORI] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[ADI] = @ADI " +
                "WHERE [KODU] = @TMPCODE",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','KODU:string|25','ADI:string|25']
    },
    RafKategoriTanimlariGetir : 
    {
        query : "SELECT KODU AS KODU,ADI AS ADI FROM RAF_KATEGORI WHERE KODU = @KODU",
        param : ['KODU'],
        type : ['string|25']
    },
    RafKategoriTanimlariSil :
    {
        query : "DELETE FROM RAF_KATEGORI WHERE KODU = @KODU",
        param : ['KODU:string|25']
    },
    PaletTanimlariKaydet : 
    {
        query : "INSERT INTO [dbo].[PALETLER]  " +
                    "([UID]  " +
                    ",[OTARIH]  " +
                    ",[KODU]  " +
                    ",[PARTI]  " +
                    ",[TIP]  " +
                    ",[MIKTAR]  " +
                    ",[RAF])  " +
                    "VALUES  " +
                    "(NEWID()       --<UID, uniqueidentifier,> \n" +
                    ",GETDATE()     --<OTARIH, datetime,> \n" +
                    ",@KODU         --<KODU, nvarchar(50),> \n" +
                    ",@PARTI        --<PARTI, nvarchar(50),> \n" +
                    ",@TIP          --<TIP, int,> \n" +
                    ",@MIKTAR       --<MIKTAR, float,> \n" +
                    ",@RAF       --<RAF, nvarchar(25),> \n" +
                    " )",
        param : ['KODU:string|50','PARTI:string|50','TIP:int','MIKTAR:float','RAF:string|25']
    },
    PaletTanimlariSil :
    {
        query : "DELETE FROM PARTILER WHERE KODU = @KODU",
        param : ['KODU:string|25']
    },
    PaletTanimlariGetir : 
    {
        query : "SELECT  PALET AS KODU,STOK AS STOK,PARTI AS PARTI,FORMAT(SKT,'dd.MM.yyyy') AS SKT,MIKTAR AS MIKTAR FROM [PALET_VIEW_01] WHERE PALET = @KODU",
        param : ['KODU'],
        type : ['string|25']
    },
    StokTanimlariKaydet : 
    {
        query : "DECLARE @TMPCODE NVARCHAR(25) " +
                "SET @TMPCODE = ISNULL((SELECT KODU FROM STOKLAR WHERE KODU = @KODU),'') " +
                "IF @TMPCODE = '' " +
                "INSERT INTO [dbo].[STOKLAR] " + 
                "([OKULLANICI] " + 
                ",[DKULLANICI] " + 
                ",[OTARIH] " + 
                ",[DTARIH] " + 
                ",[KODU] " + 
                ",[ADI] " + 
                ",[KATEGORI])" +
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@KODU			    --<KODU, nvarchar(25),> \n" +
                ",@ADI			    --<ADI, nvarchar(150),> \n" +
                ",@KATEGORI			    --<KATEGORI, nvarchar(25),> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[STOKLAR] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[ADI] = @ADI " +
                "WHERE [KODU] = @TMPCODE",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','KODU:string|25','ADI:string|150','KATEGORI:string|25']
    },
    StokTanimlariSil :
    {
        query : "DELETE FROM STOKLAR WHERE KODU = @KODU",
        param : ['KODU:string|25']
    },
    BirimTanimlariKaydet :
    {
        query : "DECLARE @TMPCODE NVARCHAR(25) " +
                "SET @TMPCODE = ISNULL((SELECT KODU FROM BIRIMLER WHERE KODU = @KODU AND STOK = @STOK),'') " +
                "IF @TMPCODE = '' " +
                "INSERT INTO [dbo].[BIRIMLER] " + 
                "([OKULLANICI] " + 
                ",[DKULLANICI] " + 
                ",[OTARIH] " + 
                ",[DTARIH] " + 
                ",[TIP] " +
                ",[STOK] " + 
                ",[KODU] " + 
                ",[ADI] " + 
                ",[KATSAYI]) " + 
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@TIP			    --<TIP, int,> \n" +
                ",@STOK			    --<STOK, nvarchar(25),> \n" +
                ",@KODU			    --<KODU, nvarchar(25),> \n" +
                ",@ADI			    --<ADI, nvarchar(150),> \n" +
                ",@KATSAYI		    --<KATSAYI, float,> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[BIRIMLER] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[TIP] = @TIP " +
                ",[ADI] = @ADI " +
                ",[KATSAYI] = @KATSAYI " +
                "WHERE [KODU] = @KODU AND STOK = @STOK",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','TIP:int','STOK:string|25','KODU:string|25','ADI:string|150','KATSAYI:float']
    },
    BarkodTanimlariKaydet :
    {
        query : "DECLARE @TMPCODE NVARCHAR(25) " +
                "SET @TMPCODE = ISNULL((SELECT KODU FROM BARKODLAR WHERE KODU = @KODU AND STOK = @STOK),'') " +
                "IF @TMPCODE = '' " +
                "INSERT INTO [dbo].[BARKODLAR] " + 
                "([OKULLANICI] " + 
                ",[DKULLANICI] " + 
                ",[OTARIH] " + 
                ",[DTARIH] " + 
                ",[KODU] " + 
                ",[STOK] " + 
                ",[BIRIM]) " + 
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@KODU			    --<KODU, nvarchar(25),> \n" +
                ",@STOK			    --<STOK, nvarchar(25),> \n" +                
                ",@BIRIM		    --<BIRIM, nvarchar(10),> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[BARKODLAR] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[KODU] = @KODU " +
                ",[STOK] = @STOK " +
                ",[BIRIM] = @BIRIM " +
                "WHERE [KODU] = @KODU AND STOK = @STOK",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','KODU:string|25','STOK:string|25','BIRIM:string|10']
    },
    EmirHarInsert :
    {
        query : "INSERT INTO [dbo].[EMIR_HAREKETLERI] " +
                "([UID] " +
                ",[OKULLANICI] " +
                ",[DKULLANICI] " +
                ",[OTARIH] " +
                ",[DTARIH] " +
                ",[TIP] " +
                ",[CINS] " +
                ",[TARIH] " +
                ",[SERI] " +
                ",[SIRA] " +
                ",[SATIRNO] " +
                ",[STOK] " +
                ",[PARTI] " +
                ",[GIRIS] " +
                ",[CIKIS] " +
                ",[BIRIM]" +
                ",[MIKTAR] " +
                ",[OZEL] " +
                ",[EMIRID] " +
                ",[DURUM] " +
                ",[AKTARIM] " +
                ",[BELGENO] " +
                ",[BARKOD]) " +
                "VALUES " +
                "(  NEWID()             --<UID, uniqueidentifier,>  \n" +
                    ",@OKULLANICI       --<OKULLANICI, nvarchar(10),>  \n" +
                    ",@DKULLANICI       --<DKULLANICI, nvarchar(10),>  \n" +
                    ",GETDATE()         --<OTARIH, datetime,>  \n" +
                    ",GETDATE()         --<DTARIH, datetime,>  \n" +
                    ",@TIP              --<TIP, smallint,>  \n" +
                    ",@CINS             --<CINS, smallint,>  \n" +
                    ",@TARIH        --<TARIH, datetime,>  \n" +
                    ",@SERI             --<SERI, nvarchar(10),>  \n" +
                    ",@SIRA             --<SIRA, int,>  \n" +
                    ",(SELECT ISNULL(MAX(SATIRNO),-1) + 1 AS SATIRNO FROM EMIR_HAREKETLERI WHERE SERI = @SERI AND SIRA = @SIRA AND CINS = @CINS)            --<SATIRNO, int,>  \n" +
                    ",@STOK             --<STOK, nvarchar(25),>  \n" +
                    ",@PARTI             --<PARTI, nvarchar(25),>  \n" +
                    ",@GIRIS            --<GIRIS, nvarchar(25),>  \n" +
                    ",@CIKIS            --<CIKIS, nvarchar(25),>  \n" +
                    ",@BIRIM           --<BIRIM, nvarchar(10),>  \n" +
                    ",@MIKTAR           --<MIKTAR, float,>  \n" +
                    ",@OZEL                --<OZEL, nvarchar(50),>  \n" +
                    ",@EMIRID             --<EMIRID, nvarchar(50),>  \n" +
                    ",0                    --<DURUM, int,>  \n" +
                    ",0                    --<AKTARIM, int,>  \n" +
                    ",@BELGENO                    --<BELGENO, varchar(50),>  \n" +
                    ",@BARKOD                    --<BARKOD, varchar(25),>  \n" +
                    " ) ",
    param :  ['OKULLANICI:string|10','DKULLANICI:string|10','TIP:int','CINS:int','TARIH:date','SERI:string|10','SIRA:int','STOK:string|25','PARTI:string|15','GIRIS:string|25','CIKIS:string|25',
            'BIRIM:string|10','MIKTAR:float','OZEL:string|50','EMIRID:string|50','BELGENO:string|50','BARKOD:string|25']
    },
    EmirHarGetir :
    {
        query : "SELECT *,(SELECT ADI FROM STOKLAR WHERE KODU = STOK) AS STOKADI FROM EMIR_HAREKETLERI WHERE TIP = @TIP AND CINS = @CINS AND SERI = @SERI AND SIRA = @SIRA",
        param :  ['TIP:int','CINS:int','SERI:string|10','SIRA:int']
    },
    EmırHarDelete :
    {
        query : "DELETE FROM EMIR_HAREKETLERI WHERE TIP = @TIP AND CINS = @CINS AND SERI = @SERI AND SIRA = @SIRA",
        param :  ['TIP:int','CINS:int','SERI:string|10','SIRA:int']
    },
    EmırHarSatirDelete :
    {
        query : "DELETE FROM EMIR_HAREKETLERI WHERE TIP = @TIP AND CINS = @CINS AND SERI = @SERI AND SIRA = @SIRA AND SATIRNO = @SATIRNO",
        param :  ['TIP:int','CINS:int','SERI:string|10','SIRA:int','SATIRNO:int']
    },
    EtiketKaydet : 
    {
        query : "INSERT INTO [dbo].[ETIKET] " + 
                "([OKULLANICI] " + 
                ",[DKULLANICI] " + 
                ",[OTARIH] " + 
                ",[DTARIH] " + 
                ",[SERI] " + 
                ",[SIRA] " + 
                ",[TARIH] " + 
                ",[PARTI] " + 
                ",[PALET] " + 
                ",[STOK] " + 
                ",[BARKOD] " + 
                ",[BIRIM] " + 
                ",[BAS_MIKTAR] " + 
                ",[DURUM]) " + 
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@SERI			    --<SERI, nvarchar(10),> \n" +
                ",@SIRA			    --<SIRA, int,> \n" +
                ",@TARIH		    --<TARIH, datetime,> \n" +
                ",@PARTI			--<PALET, nvarchar(15),> \n" +
                ",@PALET			--<PALET, nvarchar(25),> \n" +
                ",@STOK				--<STOK, nvarchar(25),> \n" +
                ",@BARKOD			--<BARKOD, nvarchar(25),> \n" +
                ",@BIRIM			--<BIRIM, nvarchar(10),> \n" +
                ",@BAS_MIKTAR		--<BAS_MIKTAR, float,> \n" +
                ",@DURUM			--<DURUM, smallint,> \n" +
                ") ",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','SERI:string|10','SIRA:int','TARIH:date','PARTI:string|15','PALET:string|25','STOK:string|25','BARKOD:string|25','BIRIM:string|10','BAS_MIKTAR:float','DURUM:int']
    },
    EtiketGetir : 
    {
        query : "SELECT SERI AS SERI,SIRA AS SIRA,FORMAT(TARIH,'dd.MM.yyyy') AS TARIH,PALET AS PALET,PARTI AS PARTI,STOK AS STOK FROM ETIKET WHERE DURUM = 2 AND SERI = @SERI AND SIRA = @SIRA ORDER BY OTARIH",
        param : ['SERI','SIRA'],
        type : ['string|10','int']
    },
    EmirlerMaxSira : 
    {
        query: "SELECT ISNULL(MAX(SIRA),0) + 1 AS MAXEVRSIRA FROM EMIR_HAREKETLERI " +
                "WHERE SERI = @SERI AND TIP = @TIP AND CINS = @CINS " ,
        param : ['SERI','TIP','CINS'],
        type : ['string|10','int','int']
    },
    RafMaxSira : 
    {
        query: "SELECT ISNULL(MAX(SIRA),0) + 1 AS MAXEVRSIRA FROM RAFLAR " ,
        param : ['SERI','TIP','CINS'],
        type : ['string|10','int','int']
    },
    EmirGetir :
    {
        query: "SELECT *, " + 
                " EMIRLER.KODU AS STOKKOD ," + 
                "(SELECT ADI FROM STOKLAR WHERE KODU = EMIRLER.KODU) AS STOKADI ," + 
                "(SELECT TOP 1 RAF FROM PALET_VIEW_01 WHERE  STOK = EMIRLER.KODU AND MIKTAR > 0 AND RAFTIP = 1 ORDER BY SKT DESC) AS RAFKODU ," + 
                "(SELECT ADI FROM BIRIMLER WHERE STOK = EMIRLER.KODU AND KODU = EMIRLER.BIRIM ) AS BIRIMADI ," + 
                "(SELECT KATSAYI FROM BIRIMLER WHERE STOK = EMIRLER.KODU AND KODU = EMIRLER.BIRIM ) AS KATSAYI ," + 
                "(SELECT ADI FROM DEPOLAR WHERE KODU = EMIRLER.GIRIS) AS SUBEADI ," + 
                "EMIRLER.UID AS EMIRUID ," +
                "EMIRLER.GIRIS AS GIRISSUBE " +
                " FROM EMIRLER " + 
                "WHERE EMIRLER.SERI = @SERI AND EMIRLER.SIRA = @SIRA AND EMIRLER.TIP = @TIP AND EMIRLER.CINS = @CINS AND EMIRLER.MIKTAR > EMIRLER.TESLIM_MIKTAR AND KAPALI != 1 " + 
                "ORDER BY (SELECT top 1 SIRA FROM RAFLAR WHERE KODU = (SELECT TOP 1 RAF FROM PALET_VIEW_01 WHERE STOK = EMIRLER.KODU AND MIKTAR > 0 AND RAFTIP = 1 ORDER BY SKT DESC))"  ,       
        param: ['SERI','SIRA','TIP','CINS'],
        type : ['string|10','int','int','int']
    },
    SevkiyatEmriGetir :
    {
        query: "SELECT  " + 
                " EMIRLER.KODU AS STOKKOD ," + 
                "(SELECT ADI FROM STOKLAR WHERE KODU = EMIRLER.KODU) AS STOKADI ," + 
                "(SELECT TOP 1 RAF FROM PALET_VIEW_01 WHERE  STOK = EMIRLER.KODU AND MIKTAR > 0 ORDER BY SKT ) AS RAFKODU ," + 
                "(SELECT TOP 1 MIKTAR FROM PALET_VIEW_01 WHERE  STOK = EMIRLER.KODU AND MIKTAR > 0 ORDER BY SKT ) AS PALETMIKTAR ," + 
                "(SELECT TOP 1 PARTI FROM PALET_VIEW_01 WHERE  STOK = EMIRLER.KODU AND MIKTAR > 0 ORDER BY SKT ) AS PARTI ," + 
                "(SELECT ADI FROM BIRIMLER WHERE STOK = EMIRLER.KODU AND KODU = EMIRLER.BIRIM ) AS BIRIMADI ," + 
                "(SELECT KATSAYI FROM BIRIMLER WHERE STOK = EMIRLER.KODU AND KODU = EMIRLER.BIRIM ) AS KATSAYI ," + 
                "EMIRLER.BIRIM AS BIRIM, " +
                "SUM(MIKTAR) AS MIKTAR, " +
                "SUM(TESLIM_MIKTAR) AS TESLIM_MIKTAR, " +
                "SUM(MIKTAR) - SUM(TESLIM_MIKTAR) AS BEKLEYEN " +
                " FROM EMIRLER " + 
                "WHERE EMIRLER.TIP = @TIP AND EMIRLER.CINS = @CINS AND EMIRNO = @EMIRNO AND EMIRLER.MIKTAR > EMIRLER.TESLIM_MIKTAR AND KAPALI != 1 " + 
                " GROUP BY KODU,BIRIM " +
                "ORDER BY (SELECT top 1 SIRA FROM RAFLAR WHERE KODU = (SELECT TOP 1 RAF FROM PALET_VIEW_01 WHERE  STOK = EMIRLER.KODU AND MIKTAR > 0 AND RAFTIP = 1 ORDER BY SKT ))"  ,       
        param: ['TIP','CINS','EMIRNO'],
        type : ['int','int','int']
    },
    BarkodGetir :
    {
        query: "SELECT(SELECT ADI FROM STOKLAR WHERE KODU = BARKODLAR.STOK) AS STOKADI,(SELECT TOP 1 KATSAYI FROM BIRIMLER WHERE STOK = BARKODLAR.STOK  AND KODU = BARKODLAR.BIRIM ) AS KATSAYI, (SELECT   TOP 1 ADI FROM BIRIMLER WHERE STOK = BARKODLAR.STOK AND KODU = BARKODLAR.BIRIM ) AS BIRIMADI, "+
        " * FROM BARKODLAR WHERE KODU = @KODU",
        param: ['KODU'],
        type:  ['string|25']
    },
    PaletEksiltme : 
    {
        query: " UPDATE PARTILER SET MIKTAR = MIKTAR - @MIKTAR WHERE KODU = @KODU",
        param: ['MIKTAR','KODU'],
        type: ['float','string|25']
    },
    CariGetir : 
    {
        query: "SELECT KODU , ADI FROM CARILER "
    },
    DepoGetir : 
    {
        query: "SELECT KODU , ADI FROM DEPOLAR where TIP = @TIP",
        param: ['TIP'],
        type: ['int']
    },
    PaletGetir : 
    {
        query: "SELECT *  FROM PARTILER WHERE KODU = @KODU ",
        param: ['KODU'],
        type: ['string|25']
    },
    PaletTanimlariUpdate :
    {
        query: "UPDATE PARTILER SET STOK = @STOK, SKT = @SKT, MIKTAR = @MIKTAR WHERE KODU = @KODU",
        param: ['STOK','SKT','MIKTAR','KODU'],
        type: ['string|50','date','float','string|50']

    },
    SiparisStokGetir :
    {
        query: "SELECT *, " +
        "(MIKTAR - TESLIM_MIKTAR) AS BEKLEYEN, " +
        "(SELECT ADI FROM STOKLAR WHERE KODU = EMIRLER.KODU) AS STOKADI, " +
        "(SELECT TOP 1 KATSAYI FROM BIRIMLER WHERE STOK = EMIRLER.KODU  AND KODU = EMIRLER.BIRIM ) AS KATSAYI, " + 
        "(SELECT  TOP 1 ADI FROM BIRIMLER WHERE STOK = EMIRLER.KODU AND KODU = EMIRLER.BIRIM ) AS BIRIMADI " +
        "FROM EMIRLER WHERE SERI = @SERI AND SIRA = @SIRA AND KODU = @STOK AND TIP = @TIP AND CINS = @CINS",
        param: ['SERI','SIRA','STOK','TIP','CINS'],
        type: ['string|50','int','string|50','int','int']
    },
    CariSiparisStokGetir :
    {
        query: "SELECT TOP 1 *, " +
        "(MIKTAR - TESLIM_MIKTAR) AS BEKLEYEN, " +
        "(SELECT ADI FROM STOKLAR WHERE KODU = EMIRLER.KODU) AS STOKADI, " +
        "(SELECT TOP 1 KATSAYI FROM BIRIMLER WHERE STOK = EMIRLER.KODU  AND KODU = (SELECT BIRIM FROM BARKODLAR WHERE KODU = @BARKOD) ) AS KATSAYI, " + 
        "(SELECT  TOP 1 ADI FROM BIRIMLER WHERE STOK = EMIRLER.KODU AND KODU = EMIRLER.BIRIM ) AS BIRIMADI " +
        "FROM EMIRLER WHERE CIKIS = @CARI AND KODU = @STOK AND TIP = @TIP AND CINS = @CINS AND  TARIH > GETDATE()- 30 AND MIKTAR > TESLIM_MIKTAR ORDER BY TARIH",
        param: ['BARKOD','CARI','STOK','TIP','CINS'],
        type: ['string|50','string|50','string|50','int','int']
    },
    MaxEmirKodu :
    {
        query: "SELECT (MAX(EMIRNO) + 1) AS MAXEMIRKOD FROM EMIRLER "
    },
    EmırNoUpdate : 
    {
        query: "UPDATE EMIRLER SET EMIRNO = @EMIRKODU WHERE UID = @UID",
        param : ['EMIRKODU:int','UID:string|50']
    },
    PartiInsert : 
    {
        query : "INSERT INTO [dbo].[PARTILER] " +
                "([UID] " +
                ",[OKULLANICI] " +
                ",[DKULLANICI] " +
                ",[OTARIH] " +
                ",[DTARIH] " +
                ",[KODU] " +
                ",[STOK] " +
                ",[TIP] " +
                ",[SKT] " +
                ",[MIKTAR]) " +
                "VALUES " +
                "(newid()            --<UID, uniqueidentifier,> \n" +
                ",@OKULLANICI        --<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI        --<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()          --<OTARIH, datetime,> \n" +
                ",GETDATE()          --<DTARIH, datetime,> \n" +
                ",@KODU              --<KODU, nvarchar(15),> \n" +
                ",@STOK              --<STOK, nvarchar(25),> \n" +
                ",@TIP               --<TIP, smallint,> \n" +
                ",@SKT                --<SKT, datetime,> \n" +
                ",@MIKTAR             --<MIKTAR, float,> \n" +
                " ) ",
        param : ['OKULLANICI','DKULLANICI','KODU','STOK','TIP','SKT','MIKTAR'],
        type: ['string|10','string|10','string|15','string|25','int','date','float']

    },
    PaletRafıUpdate :
    {
        query: "UPDATE PALETLER SET RAF = @RAF WHERE KODU = @KODU",
        param : ['RAF:string|25','KODU:string|50']
    },
    MalKabulEvrakGetir : 
    {
        query : "SELECT *,(SELECT TOP 1 ADI FROM CARILER WHERE KODU = EMIR_HAREKETLERI.CIKIS) AS CARIADI, (SELECT ADI FROM STOKLAR WHERE STOKLAR.KODU = EMIR_HAREKETLERI.STOK) AS STOKADI  FROM EMIR_HAREKETLERI WHERE TIP = 0 AND CINS = 3 AND SERI = @SERI AND SIRA = @SIRA",
        param : ['SERI:string|25','SIRA:int']

    }

    
};


