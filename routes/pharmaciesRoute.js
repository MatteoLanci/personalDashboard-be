const express = require("express");
const pharmacies = require("../middlewares/pharmacies");

const scraping = express.Router();

scraping.get("/scrape", async (req, res) => {
  const locationName = req.query.locationName;

  try {
    const scrapedData = await pharmacies(locationName);
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

module.exports = scraping;
