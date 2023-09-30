const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");

puppeteer.use(pluginStealth());

const news = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: executablePath(),
  });
  const page = await browser.newPage();

  const url = `https://agi.it/cronaca/`;
  await page.goto(url);

  const data = await page.evaluate(() => {
    const result = [];

    const newsWrapper = document.querySelectorAll(".agi-article-card");

    newsWrapper.forEach((item) => {
      const newsTitle = item.querySelector(
        ".article-content header .article-title a span"
      ).innerText;

      const imgElement = item.querySelector(".article-figure a picture source:nth-child(1)");
      const newsImg = imgElement ? imgElement.srcset : null;

      const linkElement = item.querySelector(".article-title a");
      const newsLink = linkElement ? linkElement.href : null;

      result.push({
        title: newsTitle,
        img: newsImg,
        link: newsLink,
      });
    });
    return result;
  });
  await browser.close();
  return data;
};
module.exports = news;
