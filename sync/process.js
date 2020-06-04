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
    },
    {
        name: "ALIŞ SİPARİŞİ", //GÖRÜNEN ADI
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
            query:"SELECT " + 
                  "CONVERT(nvarchar(10),sip_tarih,112) AS TARIH," + 
                  "sip_evrakno_seri AS SERI," + 
                  "sip_evrakno_sira AS SIRA," + 
                  "sip_satirno AS SATIRNO," + 
                  "sip_stok_kod AS KODU," + 
                  "CONVERT(nvarchar(25),sip_depono) AS GIRIS," + 
                  "sip_musteri_kod AS CIKIS," + 
                  "CONVERT(nvarchar(10),sip_birim_pntr) AS BIRIM," + 
                  "sip_miktar AS MIKTAR," + 
                  "sip_teslim_miktar AS TESLIM_MIKTAR," + 
                  "CONVERT(nvarchar(50),sip_Guid) AS OZEL " + 
                  "FROM SIPARISLER WHERE sip_tip = 1 AND sip_cins = 0 AND sip_tarih >= GETDATE() - 10" 
        },
        control:    //KAYITLAR KARŞI TARAFADA VAR İSE GÜNCELLEMESİ İÇİN KONTROL SORGUSU
        {
            query: "SELECT OZEL FROM EMIRLER WHERE TIP = 0 AND CINS = 3 AND OZEL = @OZEL",
            param:['OZEL:string|50']
        },
        insert:     //INSERT SORGUSU
        {
            query : "INSERT INTO [dbo].[EMIRLER](" +
                    " [OKULLANICI]" +
                    ",[DKULLANICI]" +
                    ",[OTARIH]" +
                    ",[DTARIH]" +
                    ",[TIP]" +
                    ",[CINS]" +
                    ",[TARIH]" +
                    ",[SERI]" +
                    ",[SIRA]" +
                    ",[SATIRNO]" +
                    ",[KODU]" +
                    ",[GIRIS]" +
                    ",[CIKIS]" +
                    ",[BIRIM]" +
                    ",[MIKTAR]" +
                    ",[TESLIM_MIKTAR]" +
                    ",[OZEL]" +
                    ",[KAPALI]" +
                    ") VALUES ( " +
                    " 'Admin'						--<OKULLANICI, nvarchar(10),>\n" +
                    ",'Admin'						--<DKULLANICI, nvarchar(10),>\n" +
                    ",GETDATE()						--<OTARIH, datetime,>\n" +
                    ",GETDATE()						--<DTARIH, datetime,>\n" +
                    ",0 							--<TIP, smallint,>\n" +
                    ",3 							--<CINS, smallint,>\n" +
                    ",@TARIH						--<TARIH, datetime,>\n" +
                    ",@SERI							--<SERI, nvarchar(10),>\n" +
                    ",@SIRA							--<SIRA, int,>\n" +
                    ",@SATIRNO						--<SATIRNO, int,>\n" +
                    ",@KODU							--<KODU, nvarchar(25),>\n" +
                    ",@GIRIS						--<GIRIS, nvarchar(25),>\n" +
                    ",@CIKIS						--<CIKIS, nvarchar(25),>\n" +
                    ",@BIRIM						--<BIRIM, nvarchar(10),>\n" +
                    ",@MIKTAR						--<MIKTAR, float,>\n" +
                    ",@TESLIM_MIKTAR				--<TESLIM_MIKTAR, float,>\n" +
                    ",@OZEL							--<OZEL, nvarchar(50),>\n" +
                    ",0								--<KAPALI, smallint,>\n" +
                    ")",
            param : ['TARIH:string|10','SERI:string|10','SIRA:int','SATIRNO:int','KODU:string|25','GIRIS:string|25','CIKIS:string|25',
                     'BIRIM:string|10','MIKTAR:float','TESLIM_MIKTAR:float','OZEL:string|50']
        }
    },
    {
        name: "SATIŞ SİPARİŞİ", //GÖRÜNEN ADI
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
            query:"SELECT " + 
                  "CONVERT(nvarchar(10),sip_tarih,112) AS TARIH," + 
                  "sip_evrakno_seri AS SERI," + 
                  "sip_evrakno_sira AS SIRA," + 
                  "sip_satirno AS SATIRNO," + 
                  "sip_stok_kod AS KODU," + 
                  "sip_musteri_kod AS GIRIS," + 
                  "CONVERT(nvarchar(25),sip_depono) AS CIKIS," + 
                  "CONVERT(nvarchar(10),sip_birim_pntr) AS BIRIM," + 
                  "sip_miktar AS MIKTAR," + 
                  "sip_teslim_miktar AS TESLIM_MIKTAR," + 
                  "CONVERT(nvarchar(50),sip_Guid) AS OZEL " + 
                  "FROM SIPARISLER WHERE sip_tip = 0 AND sip_cins = 0 AND sip_tarih >= GETDATE() - 10" 
        },
        control:    //KAYITLAR KARŞI TARAFADA VAR İSE GÜNCELLEMESİ İÇİN KONTROL SORGUSU
        {
            query: "SELECT OZEL FROM EMIRLER WHERE TIP = 1 AND CINS = 3 AND OZEL = @OZEL",
            param:['OZEL:string|50']
        },
        insert:     //INSERT SORGUSU
        {
            query : "INSERT INTO [dbo].[EMIRLER](" +
                    " [OKULLANICI]" +
                    ",[DKULLANICI]" +
                    ",[OTARIH]" +
                    ",[DTARIH]" +
                    ",[TIP]" +
                    ",[CINS]" +
                    ",[TARIH]" +
                    ",[SERI]" +
                    ",[SIRA]" +
                    ",[SATIRNO]" +
                    ",[KODU]" +
                    ",[GIRIS]" +
                    ",[CIKIS]" +
                    ",[BIRIM]" +
                    ",[MIKTAR]" +
                    ",[TESLIM_MIKTAR]" +
                    ",[OZEL]" +
                    ",[KAPALI]" +
                    ") VALUES ( " +
                    " 'Admin'						--<OKULLANICI, nvarchar(10),>\n" +
                    ",'Admin'						--<DKULLANICI, nvarchar(10),>\n" +
                    ",GETDATE()						--<OTARIH, datetime,>\n" +
                    ",GETDATE()						--<DTARIH, datetime,>\n" +
                    ",1 							--<TIP, smallint,>\n" +
                    ",3 							--<CINS, smallint,>\n" +
                    ",@TARIH						--<TARIH, datetime,>\n" +
                    ",@SERI							--<SERI, nvarchar(10),>\n" +
                    ",@SIRA							--<SIRA, int,>\n" +
                    ",@SATIRNO						--<SATIRNO, int,>\n" +
                    ",@KODU							--<KODU, nvarchar(25),>\n" +
                    ",@GIRIS						--<GIRIS, nvarchar(25),>\n" +
                    ",@CIKIS						--<CIKIS, nvarchar(25),>\n" +
                    ",@BIRIM						--<BIRIM, nvarchar(10),>\n" +
                    ",@MIKTAR						--<MIKTAR, float,>\n" +
                    ",@TESLIM_MIKTAR				--<TESLIM_MIKTAR, float,>\n" +
                    ",@OZEL							--<OZEL, nvarchar(50),>\n" +
                    ",0								--<KAPALI, smallint,>\n" +
                    ")",
            param : ['TARIH:string|10','SERI:string|10','SIRA:int','SATIRNO:int','KODU:string|25','GIRIS:string|25','CIKIS:string|25',
                     'BIRIM:string|10','MIKTAR:float','TESLIM_MIKTAR:float','OZEL:string|50']
        }
    }
]
module.exports = Process;