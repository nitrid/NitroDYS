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
                ",[STOK] " + 
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
                ",@STOK			    --<STOK, nvarchar(25),> \n" +
                ",@KAT			    --<KAT, smallint,> \n" +
                ",@SIRA			    --<SIRA, int,> \n" +
                ",@EN				--<EN, int,> \n" +
                ",@BOY			    --<BOY, int,> \n" +
                ",@YUKSEKLIK		--<YUKSEKLIK, int,> \n" +
                ",@KATEGORI		    --<KATEGORI, nvarchar(25),> \n" +
                ",@MIKTAR		    --<MIKTAR, flota,> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[RAFLAR] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[TIP] = @TIP " +
                ",[STOK] = @STOK " +
                ",[SIRA] = @SIRA " +
                ",[EN] = @EN " +
                ",[BOY] = @BOY " +
                ",[YUKSEKLIK] = @YUKSEKLIK " +
                ",[KATEGORI] = @KATEGORI " +
                ",[MIKTAR] = @MIKTAR " +
                "WHERE [KODU] = @TMPCODE AND [KAT] = @KAT",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','KODU:string|25','TIP:int','STOK:string|25','KAT:int','SIRA:int','EN:int','BOY:int','YUKSEKLIK:int','KATEGORI:string|25','MIKTAR:float']
    },
    RafTanimlariGetir : 
    {
        query : "SELECT KODU AS KODU,CONVERT(NVARCHAR(10),TIP) AS TIP,STOK AS STOK,CONVERT(NVARCHAR(10),KAT) AS KAT,SIRA AS SIRA,EN AS EN,BOY AS BOY,YUKSEKLIK AS YUKSEKLIK,KATEGORI AS KATEGORI,MIKTAR AS MIKTAR FROM RAFLAR WHERE KODU = @KODU",
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
        query : "DECLARE @TMPCODE NVARCHAR(25) " +
                "SET @TMPCODE = ISNULL((SELECT KODU FROM PALETLER WHERE KODU = @KODU),'') " +
                "IF @TMPCODE = '' " +
                "INSERT INTO [dbo].[PALETLER] " + 
                "([OKULLANICI] " + 
                ",[DKULLANICI] " + 
                ",[OTARIH] " + 
                ",[DTARIH] " + 
                ",[KODU] " + 
                ",[STOK] " + 
                ",[TIP] " + 
                ",[SKT] " + 
                ",[MIKTAR]) " + 
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@KODU			    --<KODU, nvarchar(15),> \n" +
                ",@STOK			    --<STOK, nvarchar(15),> \n" +
                ",@TIP			    --<TIP, int,> \n" +
                ",@SKT				--<SKT, datetime,> \n" +
                ",@MIKTAR			--<MIKTAR, float,> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[PALETLER] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[STOK] = @STOK " +
                ",[TIP] = @TIP " +
                ",[SKT] = @SKT " +
                ",[MIKTAR] = @MIKTAR " +
                "WHERE [KODU] = @TMPCODE",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','KODU:string|15','STOK:string|25','TIP:int','SKT:date','MIKTAR:float']
    },
    PaletTanimlariSil :
    {
        query : "DELETE FROM PALETLER WHERE KODU = @KODU",
        param : ['KODU:string|25']
    },
    PaletTanimlariGetir : 
    {
        query : "SELECT KODU AS KODU,STOK AS STOK,CONVERT(NVARCHAR(2),TIP) AS TIP,FORMAT(SKT,'dd.MM.yyyy') AS SKT,MIKTAR AS MIKTAR FROM PALETLER WHERE KODU = @KODU",
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
                ",[ADI]) " + 
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@KODU			    --<KODU, nvarchar(25),> \n" +
                ",@ADI			    --<ADI, nvarchar(150),> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[STOKLAR] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[ADI] = @ADI " +
                "WHERE [KODU] = @TMPCODE",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','KODU:string|25','ADI:string|150']
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
                ",[OTARIH] " +
                ",[TIP] " +
                ",[CINS] " +
                ",[TARIH] " +
                ",[SERI] " +
                ",[SIRA] " +
                ",[SATIRNO] " +
                ",[KODU] " +
                ",[GIRIS] " +
                ",[CIKIS] " +
                ",[BIRIM]" +
                ",[MIKTAR] " +
                ",[OZEL] " +
                ",[EMIRID]) " +
                "VALUES " +
                "(  NEWID()             --<UID, uniqueidentifier,>  \n" +
                    ",@OKULLANICI       --<OKULLANICI, nvarchar(10),>  \n" +
                    ",GETDATE()         --<OTARIH, datetime,>  \n" +
                    ",@TIP              --<TIP, smallint,>  \n" +
                    ",@CINS             --<CINS, smallint,>  \n" +
                    ",GETDATE()         --<TARIH, datetime,>  \n" +
                    ",@SERI             --<SERI, nvarchar(10),>  \n" +
                    ",@SIRA             --<SIRA, int,>  \n" +
                    ",(SELECT ISNULL(MAX(SATIRNO),-1) + 1 AS SATIRNO FROM EMIR_HAREKETLERI WHERE SERI = @SERI AND SIRA = @SIRA AND CINS = @CINS)            --<SATIRNO, int,>  \n" +
                    ",@KODU             --<KODU, nvarchar(25),>  \n" +
                    ",@GIRIS            --<GIRIS, nvarchar(25),>  \n" +
                    ",@CIKIS            --<CIKIS, nvarchar(25),>  \n" +
                    ",@BIRIM           --<BIRIM, nvarchar(10),>  \n" +
                    ",@MIKTAR           --<MIKTAR, float,>  \n" +
                    ",@OZEL                --<OZEL, nvarchar(50),>  \n" +
                    ",@EMIRID             --<EMIRID, nvarchar(50),>  \n" +
                    " ) ",
    param :  ['OKULLANICI:string|10','TIP:int','CINS:int','SERI:string|10','SIRA:int','KODU:string|25','GIRIS:string|25','CIKIS:string|25','BIRIM:string|10','MIKTAR:float','OZEL:string|50','EMIRID:string|50']
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
                ",@PALET			--<PALET, nvarchar(15),> \n" +
                ",@STOK				--<STOK, nvarchar(25),> \n" +
                ",@BARKOD			--<BARKOD, nvarchar(25),> \n" +
                ",@BIRIM			--<BIRIM, nvarchar(10),> \n" +
                ",@BAS_MIKTAR		--<BAS_MIKTAR, float,> \n" +
                ",@DURUM			--<DURUM, smallint,> \n" +
                ") ",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','SERI:string|10','SIRA:int','TARIH:date','PALET:string|15','STOK:string|25','BARKOD:string|25','BIRIM:string|10','BAS_MIKTAR:float','DURUM:int']
    },
    EtiketGetir : 
    {
        query : "SELECT SERI AS SERI,SIRA AS SIRA,FORMAT(TARIH,'dd.MM.yyyy') AS TARIH,PALET AS PALET,STOK AS STOK,ISNULL((SELECT MIKTAR FROM PALETLER WHERE KODU = PALET),0) AS MIKTAR FROM ETIKET WHERE SERI = @SERI AND SIRA = @SIRA",
        param : ['SERI','SIRA'],
        type : ['string|10','int']
    },
    EmirlerMaxSira : 
    {
        query: "SELECT ISNULL(MAX(SIRA),0) + 1 AS MAXEVRSIRA FROM EMIRLER " +
                "WHERE SERI = @SERI AND TIP = @TIP " ,
        param : ['SERI','TIP'],
        type : ['string|10','int']
    },
    SubeEmriGetir :
    {
        query: "SELECT EMIRLER.KODU AS STOKKOD,(SELECT ADI FROM STOKLAR WHERE KODU = EMIRLER.KODU) AS STOKADI,RAFLAR.KODU AS RAFKODU,EMIRLER.UID AS EMIRUID ," +
                "RAFLAR.KAT AS RAFKATI,EMIRLER.KODU AS EMIRKODU,(SELECT ADI FROM BIRIMLER WHERE STOK = EMIRLER.KODU AND KODU = EMIRLER.BIRIM ) AS BIRIMADI ,"+
                " (SELECT KATSAYI FROM BIRIMLER WHERE STOK = EMIRLER.KODU AND KODU = EMIRLER.BIRIM ) AS KATSAYI,(SELECT ADI FROM DEPOLAR WHERE KODU = EMIRLER.GIRIS) AS SUBEADI, * FROM EMIRLER " +
                "INNER JOIN RAFLAR " +
                "ON EMIRLER.KODU = RAFLAR.STOK  WHERE EMIRLER.SERI = @SERI AND EMIRLER.SIRA = @SIRA AND EMIRLER.TIP = @TIP AND EMIRLER.CINS = @CINS AND EMIRLER.MIKTAR > EMIRLER.TESLIM_MIKTAR AND KAPALI != 1 ORDER BY RAFLAR.SIRA " ,
        param: ['SERI','SIRA','TIP','CINS'],
        type : ['string|10','int','int','int']
    },
    BarkodGetir :
    {
        query: "SELECT(SELECT ADI FROM STOKLAR WHERE KODU = BARKODLAR.STOK) AS STOKADI,(SELECT KATSAYI FROM BIRIMLER WHERE STOK = BARKODLAR.STOK) AS KATSAYI, (SELECT ADI FROM BIRIMLER WHERE STOK = BARKODLAR.STOK) AS BIRIMADI, "+
        " * FROM BARKODLAR WHERE KODU = @KODU",
        param: ['KODU'],
        type:  ['string|25']
    },
    PaletEksiltme : 
    {
        query: " UPDATE PALETLER SET MIKTAR = MIKTAR - @MIKTAR WHERE KODU = @KODU",
        param: ['MIKTAR','KODU'],
        type: ['float','string|25']
    }
};


