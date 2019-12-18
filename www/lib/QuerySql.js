var QuerySql = 
{
    RafTanimlariKaydet : 
    {
        query : "DECLARE @TMPCODE NVARCHAR(25) " +
                "SET @TMPCODE = ISNULL((SELECT KODU FROM RAFLAR WHERE KODU = @KODU),'') " +
                "IF @TMPCODE = '' " +
                "INSERT INTO [dbo].[RAFLAR] " + 
                "([OKULLANICI] " + 
                ",[DKULLANICI] " + 
                ",[OTARIH] " + 
                ",[DTARIH] " + 
                ",[KODU] " + 
                ",[KAT] " + 
                ",[SIRA] " + 
                ",[EN] " + 
                ",[BOY] " + 
                ",[YUKSEKLIK] " + 
                ",[KATEGORI]) " + 
                "VALUES " + 
                "(@OKULLANICI		--<OKULLANICI, nvarchar(10),> \n" +
                ",@DKULLANICI		--<DKULLANICI, nvarchar(10),> \n" +
                ",GETDATE()		    --<OTARIH, datetime,> \n" +
                ",GETDATE()		    --<DTARIH, datetime,> \n" +
                ",@KODU			    --<KODU, nvarchar(25),> \n" +
                ",@KAT			    --<KAT, smallint,> \n" +
                ",@SIRA			    --<SIRA, int,> \n" +
                ",@EN				--<EN, int,> \n" +
                ",@BOY			    --<BOY, int,> \n" +
                ",@YUKSEKLIK		--<YUKSEKLIK, int,> \n" +
                ",@KATEGORI		    --<KATEGORI, nvarchar(25),> \n" +
                ") " +
                "ELSE " + 
                "UPDATE [dbo].[RAFLAR] SET " +
                "[DKULLANICI] = @DKULLANICI " +
                ",[DTARIH] = GETDATE() " +
                ",[KAT] = @KAT " +
                ",[SIRA] = @SIRA " +
                ",[EN] = @EN " +
                ",[BOY] = @BOY " +
                ",[YUKSEKLIK] = @YUKSEKLIK " +
                ",[KATEGORI] = @KATEGORI " +
                "WHERE [KODU] = @TMPCODE",
        param : ['OKULLANICI:string|10','DKULLANICI:string|10','KODU:string|25','KAT:int','SIRA:int','EN:int','BOY:int','YUKSEKLIK:int','KATEGORI:string|25']
    },
    RafTanimlariGetir : 
    {
        query : "SELECT KODU AS KODU,CONVERT(NVARCHAR(10),KAT) AS KAT,SIRA AS SIRA,EN AS EN,BOY AS BOY,YUKSEKLIK AS YUKSEKLIK,KATEGORI AS KATEGORI FROM RAFLAR WHERE KODU = @KODU",
        param : ['KODU'],
        type : ['string|25']
    },
    RafTanimlariSil :
    {
        query : "DELETE FROM RAFLAR WHERE KODU = @KODU",
        param : ['KODU:string|25']
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
    }
};


