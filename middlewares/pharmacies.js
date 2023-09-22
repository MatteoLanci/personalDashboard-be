const puppeteer = require("puppeteer");
const proxy = "";

const pharmacies = async (locationName) => {
  const browser = await puppeteer.launch({ headless: "new", args: [`--proxy-server=${proxy}`] });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "upgrade-insecure-requests": "1",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,en;q=0.8",
  });

  const url = `https://www.paginegialle.it/farmacie-turno/${locationName}`;

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
