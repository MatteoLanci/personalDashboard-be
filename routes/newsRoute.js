const express = require("express");
const news = require("../middlewares/news");

const scrapingNews = express.Router();

scrapingNews.get("/scrapenews", async (req, res) => {
  try {
    const scrapedData = await news();
    res.json(scrapedData);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      statusCode: 500,
      message: "Error while scraping: ",
      error,
    });
  }
});

module.exports = scrapingNews;
