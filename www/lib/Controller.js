angular.module('app.controller', [])
.controller('Login',['$scope','$window','db',Login])
.controller('Main',['$scope','$rootScope','$window','db',Main])
.controller('RafTanimlari',['$scope','$window','db',RafTanimlari])
.controller('RafKategoriTanimlari',['$scope','$window','db',RafKategoriTanimlari])
.controller('PaletTanimlari',['$scope','$window','db',PaletTanimlari])
.controller('StokTanimlari',['$scope','$window','db',StokTanimlari])
.controller('PaletAdresleme',['$scope','$window','db',PaletAdresleme])
.controller('SubeEmirKapatma',['$scope','$window','db',SubeEmirKapatma])
.controller('MalKabul',['$scope','$window','db',MalKabul])
.controller('SiparisMalKabul',['$scope','$window','db',SiparisMalKabul])
.controller('ToplamaEmriOlustur',['$scope','$window','db',ToplamaEmriOlustur])
.controller('SevkiyatEmriKapama',['$scope','$window','db',SevkiyatEmriKapama])
.controller('ToplamaAlaniTransfer',['$scope','$window','db',ToplamaAlaniTransfer])
.controller('BosRaflar',['$scope','$window','db',BosRaflar])
.controller('StokDurumRapor',['$scope','$window','db',StokDurumRapor])
.controller('PersonelTanimlari',['$scope','$window','db',PersonelTanimlari])
.controller('StokVeRafTanitim',['$scope','$window','db',StokVeRafTanitim])
.controller('KullaniciParametreCtrl',['$scope','$window','db',KullaniciParametreCtrl])

