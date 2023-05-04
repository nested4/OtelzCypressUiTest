/// <reference types="Cypress" />
describe('Otelz.com Test', () => {

  it('Performs a booking', () => {

    cy.visit('https://web-app.dev.otelz.com/')
    // Verify the page loaded successfully
    cy.title().should('eq', 'En Uygun Oteller ve Otel Fiyatları ile Rezervasyon | Otelz.com');

    // Enter search details
    cy.get('[data-testid="locationSearchBtn"]').type('İstanbul')
    cy.get('[data-testid="locationSearchBtn"]').should('have.value','İstanbul')
    cy.get('[data-testid="locationSearchBtn"]').clear().type('Adilcevaz').type('{Enter}')
    
    cy.get('.sc-a26d6d0-0').click()
    cy.get(':nth-child(1) > .react-datepicker__day--005').click()
    cy.get(':nth-child(1) > .react-datepicker__day--007').click()
    cy.get('.search-btn').click()

    // Verify search results
    cy.get('.price').first().then(($price) => {
      var hotelPrice = $price.text()
      console.log(hotelPrice);

      // Click on first hotel
      cy.get('[data-testid="otel-1"] > div > a').first().invoke('removeAttr', 'target'). click()

      // Verify hotel details page
      cy.get('.net-price').should('have.text', hotelPrice)
      //Select two rooms and click make reservation button
      cy.xpath('(//select[@class="roomSelectBox"])[1]').select('2')
      cy.xpath('(//button[.="Rezervasyon yap"])[3]').click()

      // Enter booking details
      cy.get('[name="customerInfo.name"]').type('John')
      cy.get('[name="customerInfo.surname"]').type('Doe')
      cy.get('[name="customerInfo.email"]').type('johndoe@example.com')
      cy.get('[name="customerInfo.phone"]').type('5555555555')
      cy.get('[name="roomInfo[1].persons[0].name"]').type('Adam')
      cy.get('[name="roomInfo[1].persons[0].surname"]').type('Smith')
      cy.xpath('//button[@type="submit"]').click()

      // Payment options
      cy.xpath('//span[text()="Online şimdi öde"]').click()
          cy.get('[name="cardInfo.holderName"]').type('John Doe')
          cy.get('[name="cardInfo.cardNumber"]').type('5454545454545454')
          cy.get('select[name="cardInfo.month"]').select('1')
          cy.get('select[name="cardInfo.year"]').select('2026')
          cy.get('[name="cardInfo.ccV2"]').type('001')
          cy.xpath('//button[@type="submit"]').click()

          // const getIframeDocument = () => {
          //   return cy
          //   .xpath("//iframe[@title='3d']")
          //   // Cypress yields jQuery element, which has the real
          //   // DOM element under property "0".
          //   // From the real DOM iframe element we can get
          //   // the "document" element, it is stored in "contentDocument" property
          //   // Cypress "its" command can access deep properties using dot notation
          //   // https://on.cypress.io/its
          //   .its('0.contentDocument').should('exist')
          // }
          
          // const getIframeBody = () => {
          //   // get the document
          //   return getIframeDocument()
          //   // automatically retries until body is loaded
          //   .its('body').should('not.be.undefined')
          //   // wraps "body" DOM element to allow
          //   // chaining more Cypress commands, like ".find(...)"
          //   .then(cy.wrap)
          // }

          // getIframeBody().find('#run-button').should('have.text', 'Try it').click()


          // cy.xpath("//iframe[@title='3d']").its('0.contentDocument.body').then(cy.wrap).xpath('//"input#smsCode""]').type('201409')


          // cy.xpath("//iframe[@title='3d']").then(function($ele)
          // {
          //   var ifele= $ele.contents().find("input#smsCode").type('201409')
          // }
          // )


        // Enter SMS code in the iframe
 // Select the iframe and switch to it
// cy.getIframe('.sc-8399c98-1')
// Switch back to the main window
// cy.switchTo('default')
        // cy.get('input#smsCode').type('201409')
// cy.frameLoaded('.sc-8399c98-1')
// 

// cy.iframe('.sc-8399c98-1').find('input#smsCode').type('201409')

      


      // Verify booking confirmation
      cy.url().should('include', 'reservation-summary')
      cy.get('.reservation-number').then(($reservationNumber) => {
        const reservationNumber = $reservationNumber.text()
        cy.get('.pin-code').then(($pinCode) => {
          const pinCode = $pinCode.text()

          // Go to reservation management page
          cy.visit('https://web-app.dev.otelz.com/forms/manage-reservation')
          cy.get('#reservation-code').type(reservationNumber)
          cy.get('#pin-code').type(pinCode)
          cy.get('.submit-button').click()

          // Verify reservation details
          cy.get('.total-price').should('have.text', hotelPrice)
          cy.get('.reservation-status').should('have.text', 'Confirmed')
        })
      })
    })
  
  })
})

   
          

// 1.	"https://web-app.dev.otelz.com/" adresine gidilir ve açıldığı doğrulanır
// 2.	Arama kutusuna "İstanbul" yazılır ve doğrulama yapıldıktan sonra silinir
// 3.	Arama kutusuna "Adilcevaz" yazılır
// 4.	Tarih kutusu açılır ve gidiş için 4 gün, dönüş için 6 gün ilerisi seçilir ve arama butonuna basılır.
// 5.	Arama sonuçta ilk çıkan otelin fiyat bilgisi alınır ve ilk otelle tıklanır
// 6.	Tesis detay sayfasında fiyat doğrulanır ve alt oda seçenekleri alanından iki oda seçilir ve rezervasyon yap butonuna tıklanır.
// 7.	Rezervasyon 1. sayfasında kişi bilgileri alanı birkaç kez farklı veriler girilir (Telefon kodu, mail adresi, isim ve soyisim alanı) 
//ve devam et butonuna tıklanır.
// 8.	Rezervasyon 2. sayfasında "Online ödeme" seçeneği var ise Online ödeme.ile devam edilir, yoksa sırası ile Kredi kartı ile garantile, 
//Kredi kartsız garantile seçilir ve rezervasyon tamamlanır.
// 9.	Rezervasyon 3. sayfada rezervasyonun gerçekleştiği kontrol edilir.
// 10.	Rezervasyon 3. sayfada yer alan rezervasyon numarası ve pin kodu alınır ve "https://web-app.dev.otelz.com/forms/manage-reservation" 
//sayfasına girilir
// 11.	Rezervasyon yönet sayfasında rezervasyonun başarılı olduğu ve fiyat alanlarının olduğu doğrulanır.
// Not: Test ortamımızda developer kartları çalışmaktadır.
// https://developers.bluesnap.com/reference/test-credit-cards
// Örnek Kart No; 5454 5454 5454 5454   Son Kullanma Tarihi 01/2026  CVV 001


// Android App Otomasyonu
// Android apps otomasyonu için Java ile Maven projesi oluşturulmalı, TestNG(veya Junit), Appium kullanılması gerekmektedir.
// 1.	Uygulama başlatılır ve tanıtım sayfalarında 2 kere sağa kaydırılır ve devam butonuna tıklanır
// 2.	Otel sekmesinde "Ankara" girilir ve ilk seçenek seçilir
// 3.	Tarih sekmesi açılır ve gidiş tarihi 3, dönüş için 5 gün ilerisi seçilir ve arama butonuna basılır.
// 4.	İlk çıkan tesisin isim ve fiyat bilgisi alınır ve tesis sayfası açılır
// 5.	Tesis sayfasında tesisin ismi ve fiyatı doğrulanır
// 6.	"Diğer Oda Seçenekleri" butonuna basılır ve bir oda seçilir
// 7.	Rezervasyon 1. sayfasında kişi bilgileri girilir ve "Sonraki Adım" butonuna tıklanır
// 8.	Rezervasyon 2. sayfasında kupon alanı açılır ve "APP05" girilir, kullan butonuna tıklanır ve uyarı mesajı geldiği doğrulanır.

// Web Servis Otomasyon
// Web servis otomasyonu için Cypress kullanılması gerekmektedir.
// Api Bilgileri
// - https://trello.com/app-key  Key ve token bilgilerine giriş yaptıktan sonra ulaşabilirsiniz
// - https://developer.atlassian.com/cloud/trello/rest/   Trello request lerin listesi.
// Not: Token url ulaşmak için trelloda login olup ayrı bir sekmeden token url’ine gitmeniz gerekmektedir.
// 1.	Trello üzerinde bir board oluşturunuz.
// 2.	Oluşturduğunuz board’ a iki tane kart oluşturunuz.
// 3.	Oluşturduğunuz bu iki karttan random olacak şekilde bir tanesini güncelleyiniz.
// 4.	Oluşturduğunuz kartları siliniz.
// 5.	Oluşturduğunuz board’ u siliniz.

// Projeleri salı günü gün sonuna kadar tamamlayıp github repo bilgisini bizimle paylaşmanız bekleniyor, bunların dışında www.otelz.com 
//adresimizde case/bug bulup bize iletirseniz büyük bir artıdır. 

// Herhangi bir sorun yaşamanız durumunda bu mail üzerinden bildirebilirsiniz.

// Mobile app uygulamasını ek olarak paylaşıyorum.
//   Otelz-dev.apk
// Maili aldığınıza dair bize geri dönüş yaparsanız çok seviniriz.

// İyi çalışmalar.
