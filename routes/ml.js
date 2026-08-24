// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// router.post("/predict", async (req, res) => {
//   try {

//     const response = await axios.post(
//       "http://localhost:8000/predict",
//       req.body
//     );

//     res.json(response.data);

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       error: "Prediction failed"
//     });
//   }
// });

// module.exports = router;









const express = require('express');
const router = express.Router();

const mlService = require('../services/mlService');

/**
 * GET
 * /api/ml/forecast?lat=5.6037&lon=-0.1870
 */
router.get('/forecast', async (req, res) => {

    try {

        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({
                error: 'Valid latitude and longitude are required'
            });
        }

        const prediction =
            await mlService.forecast(lat, lon);

        res.json(prediction);

    } catch (error) {

        console.error(
            'ML Forecast Error:',
            error.response?.data || error.message
        );

        res.status(500).json({
            error: 'Prediction failed'
        });
    }
});

module.exports = router;
``