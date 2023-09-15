const express = require("express");
const puppeteer = require("puppeteer");
const gsearch = express.Router();

async function searchGoogleImages(query) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.google.com/images?q=${encodeURIComponent(query)}`);
  await page.waitForSelector("img");

  const imageUrl = await page.evaluate(() => {
    const imgElement = document.querySelector("img");
    return imgElement ? imgElement.src : null;
  });

  await browser.close();
  return imageUrl;
}

gsearch.get("/api/search-images", async (req, res) => {
  const query = req.query.query;

  try {
    const imageUrl = await searchGoogleImages(query);

    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      res.json({ imageUrl: null });
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Error occurs during image search" });
  }
});

module.exports = gsearch;
