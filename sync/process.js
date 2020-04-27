let Process = 
[
    {
        name: "STOK", //GÖRÜNEN ADI
        source : //KAYNAK VERİTABANI BAĞLANTISI
        {
            server: "192.168.100.12",
            database:"MikroDB_V16_TEST",
            uid:"beka",
            pwd:"1122334455"
        },
        target : //HEDEF VERİTABANI BAĞLANTISI
        {
            server: "192.168.100.12",
            database:"NTGDB",
            uid:"beka",
            pwd:"1122334455"
        },
        auto: 6000,  //OTOMATİK AKTARIM YAPILACAKSA BURAYA MİLİSANİYE CİNSİNDEN SÜRE YAZILIR (1000 = 1 SN) UNDEFINED VEYA BU KEY TANIMLANMAZSA OTOMATİK AKTARILMAZ.
        select :    //KAYITLARIN GETİRİLECEĞİ SELECT SORGUSU
        {
            query:"SELECT sto_kod AS KODU,sto_isim AS ADI,'' AS KATEGORI,dbo.fn_VergiYuzde(sto_toptan_vergi) AS KDV,sto_anagrup_kod AS ANAGRUPKODU FROM STOKLAR"
        },
        control:    //KAYITLAR KARŞI TARAFADA VAR İSE GÜNCELLEMESİ İÇİN KONTROL SORGUSU
        {
            query: "SELECT KODU FROM STOKLAR WHERE KODU = @KODU",
            param:['KODU:string|25']
        },
        update:     //UPDATE SORGUSU
        {
            query: "UPDATE STOKLAR SET ADI = @ADI, KATEGORI = @KATEGORI, KDV = @KDV, ANAGRUPKODU = @ANAGRUPKODU WHERE KODU = @KODU",
            param : ['KODU:string|25','ADI:string|150','KATEGORI:string|25','KDV:float','ANAGRUPKODU:string|25']
        },
        insert:     //INSERT SORGUSU
        {
            query : "INSERT INTO [dbo].[STOKLAR] " +
                    "([OKULLANICI] " +
                    ",[DKULLANICI] " +
                    ",[OTARIH] " +
                    ",[DTARIH] " +
                    ",[KODU] " +
                    ",[ADI] " +
                    ",[KATEGORI] " +
                    ",[KDV] " +
                    ",[ANAGRUPKODU] " +
                    ") VALUES ( " +
                    "'Admin'		--<OKULLANICI, nvarchar(10),> \n" +
                    ",'Admin'		--<DKULLANICI, nvarchar(10),> \n" +
                    ",GETDATE()		--<OTARIH, datetime,> \n" +
                    ",GETDATE()		--<DTARIH, datetime,> \n" +
                    ",@KODU			--<KODU, nvarchar(25),> \n" +
                    ",@ADI			--<ADI, nvarchar(150),> \n" +
                    ",@KATEGORI		--<KATEGORI, nvarchar(25),> \n" +
                    ",@KDV			--<KDV, float,> \n" +
                    ",@ANAGRUPKODU		--<ANAGRUPKODU, nvarchar(25),> \n" +
                    ")",
            param : ['KODU:string|25','ADI:string|150','KATEGORI:string|25','KDV:float','ANAGRUPKODU:string|25']
        }
    },
    {
        name: "BARKOD", //GÖRÜNEN ADI
        source : //KAYNAK VERİTABANI BAĞLANTISI
        {
            server: "192.168.100.12",
            database:"MikroDB_V16_TEST",
            uid:"beka",
            pwd:"1122334455"
        },
        target : //HEDEF VERİTABANI BAĞLANTISI
        {
            server: "192.168.100.12",
            database:"NTGDB",
            uid:"beka",
            pwd:"1122334455"
        },
        auto: 8000,  //OTOMATİK AKTARIM YAPILACAKSA BURAYA MİLİSANİYE CİNSİNDEN SÜRE YAZILIR (1000 = 1 SN) UNDEFINED VEYA BU KEY TANIMLANMAZSA OTOMATİK AKTARILMAZ.
        select :    //KAYITLARIN GETİRİLECEĞİ SELECT SORGUSU
        {
            query:"SELECT bar_kodu AS KODU,bar_stokkodu AS STOK,bar_birimpntr AS BIRIM FROM BARKOD_TANIMLARI"
        },
        control:    //KAYITLAR KARŞI TARAFADA VAR İSE GÜNCELLEMESİ İÇİN KONTROL SORGUSU
        {
            query: "SELECT KODU FROM BARKODLAR WHERE KODU = @KODU",
            param:['KODU:string|25']
        },
        update:     //UPDATE SORGUSU
        {
            query: "UPDATE BARKODLAR SET STOK = @STOK WHERE KODU = @KODU",
            param : ['KODU:string|25','STOK:string|25']
        },
        insert:     //INSERT SORGUSU
        {
            query : "INSERT INTO [dbo].[BARKODLAR] " +
                    "([OKULLANICI] " +
                    ",[DKULLANICI] " +
                    ",[OTARIH] " +
                    ",[DTARIH] " +
                    ",[KODU] " +
                    ",[STOK] " +
                    ",[BIRIM] " +
                    ") VALUES ( " +
                    "'Admin'		--<OKULLANICI, nvarchar(10),> \n" +
                    ",'Admin'		--<DKULLANICI, nvarchar(10),> \n" +
                    ",GETDATE()		--<OTARIH, datetime,> \n" +
                    ",GETDATE()		--<DTARIH, datetime,> \n" +
                    ",@KODU			--<KODU, nvarchar(25),> \n" +
                    ",@STOK			--<STOK, nvarchar(25),> \n" +
                    ",@BIRIM		--<BIRIM, nvarchar(10),> \n" +
                    ")",
            param : ['KODU:string|25','STOK:string|25','BIRIM:string|25']
        }
    },
    {
        name: "BIRIM", //GÖRÜNEN ADI
        source : //KAYNAK VERİTABANI BAĞLANTISI
        {
            server: "192.168.100.12",
            database:"MikroDB_V16_TEST",
            uid:"beka",
            pwd:"1122334455"
        },
        target : //HEDEF VERİTABANI BAĞLANTISI
        {
            server: "192.168.100.12",
            database:"NTGDB",
            uid:"beka",
            pwd:"1122334455"
        },
        auto: 9000,  //OTOMATİK AKTARIM YAPILACAKSA BURAYA MİLİSANİYE CİNSİNDEN SÜRE YAZILIR (1000 = 1 SN) UNDEFINED VEYA BU KEY TANIMLANMAZSA OTOMATİK AKTARILMAZ.
        select :    //KAYITLARIN GETİRİLECEĞİ SELECT SORGUSU
        {
            query:"SELECT sto_kod AS STOK,sto_birimID AS KODU,sto_birim_ad AS ADI,CASE WHEN sto_birim_katsayi < 0 THEN sto_birim_katsayi * -1 ELSE sto_birim_katsayi END AS KATSAYI FROM STOK_BIRIM_TANIMLARI_DIKEY"
        },
        control:    //KAYITLAR KARŞI TARAFADA VAR İSE GÜNCELLEMESİ İÇİN KONTROL SORGUSU
        {
            query: "SELECT KODU FROM BIRIMLER WHERE KODU = @KODU AND STOK = @STOK",
            param:['KODU:string|10','STOK:string|25']
        },
        update:     //UPDATE SORGUSU
        {
            query: "UPDATE BIRIMLER SET KATSAYI = @KATSAYI WHERE KODU = @KODU AND STOK = @STOK",
            param : ['KATSAYI:float','KODU:string|10','STOK:string|25']
        },
        insert:     //INSERT SORGUSU
        {
            query : "INSERT INTO [dbo].[BIRIMLER] " +
                    "([OKULLANICI] " +
                    ",[DKULLANICI] " +
                    ",[OTARIH] " +
                    ",[DTARIH] " +
                    ",[TIP] " +
                    ",[STOK] " +
                    ",[KODU] " +                    
                    ",[ADI] " +
                    ",[KATSAYI] " +
                    ") VALUES ( " +
                    "'Admin'		--<OKULLANICI, nvarchar(10),> \n" +
                    ",'Admin'		--<DKULLANICI, nvarchar(10),> \n" +
                    ",GETDATE()		--<OTARIH, datetime,> \n" +
                    ",GETDATE()		--<DTARIH, datetime,> \n" +
                    ",0 			--<TIP, smallint,> \n" +
                    ",@STOK			--<STOK, nvarchar(25),> \n" +
                    ",@KODU			--<KODU, nvarchar(10),> \n" +
                    ",@ADI		    --<ADI, nvarchar(25),> \n" +
                    ",@KATSAYI		--<KATSAYI, float,> \n" +
                    ")",
            param : ['STOK:string|25','KODU:string|10','ADI:string|25','KATSAYI:float']
        }
    }
]
module.exports = Process;