/// <reference types="Cypress" />
describe("Otelz.com Test", () => {
  it("Performs a booking", () => {
    cy.visit("https://web-app.dev.otelz.com/");
    // Verify the page loaded successfully
    cy.title().should(
      "eq",
      "En Uygun Oteller ve Otel Fiyatları ile Rezervasyon | Otelz.com"
    );

    // Enter search details
    cy.get('[data-testid="locationSearchBtn"]').type("İstanbul");
    cy.get('[data-testid="locationSearchBtn"]').should(
      "have.value",
      "İstanbul"
    );
    cy.get('[data-testid="locationSearchBtn"]')
      .clear()
      .type("Iğdır")
      .then(() => {
        cy.get("[data-id='r-0']").click();
      });

    cy.get(".sc-a26d6d0-0").click();

    cy.get("[tabindex='0']")
      .invoke("text")
      .then((text) => {
        let currentDay = Number(text);
        let day1 = currentDay + 4;
        let day2 = currentDay + 6;

        let daysInMonth = new Date().getMonth() === 1 ? 28 : 30;
        if ([4, 6, 9, 11].includes(new Date().getMonth())) daysInMonth = 31;

        if (day1 > daysInMonth) day1 = day1 - daysInMonth;
        if (day2 > daysInMonth) day2 = day2 - daysInMonth;

        const day1Selector =
          day1 < 10
            ? `.react-datepicker__day--00${day1}`
            : `.react-datepicker__day--0${day1}`;
        const day2Selector =
          day2 < 10
            ? `.react-datepicker__day--00${day2}`
            : `.react-datepicker__day--0${day2}`;

        cy.get(day1Selector).eq(0).click();
        cy.get(day2Selector).eq(0).click();
      });

    cy.get(".search-btn").click();

    // Verify search results
    cy.get(".price", { timeout: 15000 })
      .first()
      .then(($price) => {
        var hotelPrice = $price.text();

        // Click on first hotel
        cy.get('[data-testid="otel-1"] > div > a')
          .first()
          .invoke("removeAttr", "target")
          .click();

        // Verify hotel details page
        cy.get(".net-price", { timeout: 15000 })
          .eq(0)
          .scrollIntoView()
          .then(($el) => {
            expect(hotelPrice).contain($el.text());
          });

        //Select two rooms and click make reservation button
        cy.xpath('(//select[@class="roomSelectBox"])[1]', {
          timeout: 10000,
        }).select("2", { force: true });
        cy.xpath('(//button[.="Rezervasyon yap"])[3]').click();

        // Enter booking details
        cy.get('[name="customerInfo.name"]').type("John");
        cy.get('[name="customerInfo.surname"]').type("Doe");
        cy.get('[name="customerInfo.email"]').type("johndoe@example.com");
        cy.get('[name="customerInfo.phone"]').type("5555555555");
        cy.get('[name="roomInfo[1].persons[0].name"]').type("Adam");
        cy.get('[name="roomInfo[1].persons[0].surname"]').type("Smith");
        cy.xpath('//button[@type="submit"]').click();

        // Payment options
        cy.xpath('//span[text()="Online şimdi öde"]').click();
        cy.get('[name="cardInfo.holderName"]').type("John Doe");
        cy.get('[name="cardInfo.cardNumber"]').type("5454545454545454");
        cy.get('select[name="cardInfo.month"]').select("1");
        cy.get('select[name="cardInfo.year"]').select("2026");
        cy.get('[name="cardInfo.ccV2"]').type("001");
        cy.xpath('//button[@type="submit"]').click();

       
        cy.wait(4000);
        cy.get("[class*='sc-8399c98-1']")
          .should("be.visible")
          .then(($iframe) => {
            const $body = $iframe.contents().find("body");
            cy.wrap($body)
              .find(`input#smsCode`)
              .should("be.visible")
              .type("201409{enter}");
          });

        // Verify booking confirmation
        cy.contains("Rezervasyonunuz onaylandı!").should("be.visible");
        cy.get(".box.resNumber span").then(($reservationNumber) => {
          const reservationNumber = $reservationNumber.text();
          cy.get(".box.pincode span").then(($pinCode) => {
            const pinCode = $pinCode.text();

            // Go to reservation management page
            cy.visit("https://web-app.dev.otelz.com/forms/manage-reservation");

            cy.get("[name='reservationCode']").type(reservationNumber);
            cy.get("[name='pinCode']").type(pinCode);
            cy.get("[type='submit']").click();

            // Verify reservation details
            cy.contains("Rezervasyonunuz Onaylandı").should("be.visible");
            cy.contains("Rezervasyon tutarı").should("be.visible");
            cy.contains("Online ödeme indirimi").should("be.visible");
            cy.contains("Tahsil edilen tutar").should("be.visible");
          });
        });
      });
  });
});


/*
1.	"https://web-app.dev.otelz.com/" adresine gidilir ve açıldığı doğrulanır
2.	Arama kutusuna "İstanbul" yazılır ve doğrulama yapıldıktan sonra silinir
3.	Arama kutusuna "Adilcevaz" yazılır.
4.	Tarih kutusu açılır ve gidiş için 4 gün, dönüş için 6 gün ilerisi seçilir ve arama butonuna basılır.
5.	Arama sonuçta ilk çıkan otelin fiyat bilgisi alınır ve ilk otelle tıklanır
6.	Tesis detay sayfasında fiyat doğrulanır ve alt oda seçenekleri alanından iki oda seçilir ve rezervasyon yap butonuna tıklanır.
7.	Rezervasyon 1. sayfasında kişi bilgileri alanı birkaç kez farklı veriler girilir (Telefon kodu, mail adresi, isim ve soyisim alanı) 
ve devam et butonuna tıklanır.
8.	Rezervasyon 2. sayfasında "Online ödeme" seçeneği var ise Online ödeme.ile devam edilir, yoksa sırası ile Kredi kartı ile garantile, 
Kredi kartsız garantile seçilir ve rezervasyon tamamlanır.
9.	Rezervasyon 3. sayfada rezervasyonun gerçekleştiği kontrol edilir.
10.	Rezervasyon 3. sayfada yer alan rezervasyon numarası ve pin kodu alınır ve "https://web-app.dev.otelz.com/forms/manage-reservation" 
sayfasına girilir
11.	Rezervasyon yönet sayfasında rezervasyonun başarılı olduğu ve fiyat alanlarının olduğu doğrulanır.
Not: Test ortamımızda developer kartları çalışmaktadır.
https://developers.bluesnap.com/reference/test-credit-cards
Örnek Kart No; 5454 5454 5454 5454   Son Kullanma Tarihi 01/2026  CVV 001
*Note: Adilcevaz serverdan kaldirilmis. Onun yerine Igdir test edildi. Bilgi
 */
