const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/predict", async (req, res) => {
  try {

    const response = await axios.post(
      "http://localhost:8000/predict",
      req.body
    );

    res.json(response.data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Prediction failed"
    });
  }
});

module.exports = router;