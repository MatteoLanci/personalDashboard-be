const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");

puppeteer.use(pluginStealth());

const pharmacies = async (locationName) => {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: executablePath(),
  });
  const page = await browser.newPage();

  const url = `https://www.paginegialle.it/ricerca/farmacie/${locationName}`;
  await page.goto(url);

  const data = await page.evaluate(() => {
    const result = [];

    const pharmaWrapper = document.querySelectorAll(".search-itm");

    pharmaWrapper.forEach((item) => {
      const pharmaName = item.querySelector(".search-itm__rag").innerText;
      const pharmaAddress = item.querySelector(".search-itm__adr").innerText;
      const pharmaDescription = item.querySelector(".search-itm__dsc").innerText;

      const pharmaInfo = item.querySelector(".search-itm__note span span").innerText;

      const pharmaPhoneElement = item.querySelector(
        ".search-itm__footer .search-itm__shownum .hidden .search-itm__ballonIcons li:nth-child(1)"
      );
      const pharmaPhone = pharmaPhoneElement ? pharmaPhoneElement.innerText : "";

      result.push({
        name: pharmaName,
        address: pharmaAddress,
        desc: pharmaDescription,
        phone: pharmaPhone,
        info: pharmaInfo,
      });
    });

    return result;
  });

  await browser.close();

  return data;
};

module.exports = pharmacies;
