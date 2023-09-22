const puppeteer = require("puppeteer");
var useragent = require("user-agents");

const pharmacies = async (locationName) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const url = `https://www.paginegialle.it/farmacie-turno/${locationName}`;

  await page.setUserAgent(useragent.toString());

  await page.goto(url);

  const data = await page.evaluate(() => {
    const result = [];

    const pharmaWrapper = document.querySelectorAll(".search-itm");

    pharmaWrapper.forEach((item) => {
      const pharmaName = item.querySelector(".search-itm__rag").innerText;
      const pharmaAddress = item.querySelector(".search-itm__adr").innerText;
      const pharmaDescription = item.querySelector(".search-itm__dsc").innerText;

      const pharmaTimeElement = item.querySelector(".search-itm__vrt-hour span:nth-child(3) span");
      const pharmaTime = pharmaTimeElement ? pharmaTimeElement.innerText : "";

      const pharmaPhoneElement = item.querySelector(
        ".search-itm__footer .search-itm__shownum .hidden .search-itm__ballonIcons li:nth-child(1)"
      );
      const pharmaPhone = pharmaPhoneElement ? pharmaPhoneElement.innerText : "";

      const pharmaDistanceElement = item.querySelector(".search-itm__dx .search-itm__dist span");
      const pharmaDistance = pharmaDistanceElement ? pharmaDistanceElement.innerText : "";

      result.push({
        name: pharmaName,
        address: pharmaAddress,
        desc: pharmaDescription,
        time: pharmaTime,
        phone: pharmaPhone,
        distance: pharmaDistance,
      });
    });

    return result;
  });

  await browser.close();

  return data;
};

module.exports = pharmacies;
