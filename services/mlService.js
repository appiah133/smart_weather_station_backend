// const axios = require('axios');

// const ML_URL =
//     process.env.ML_SERVICE_URL;

// async function forecast(lat, lon) {

//     const response =
//         await axios.post(
//             `${ML_URL}/forecast`,
//             {
//                 latitude: lat,
//                 longitude: lon
//             }
//         );

//     return response.data;
// }

// module.exports = {
//     forecast
// };







const axios = require('axios');

const ML_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

if (!process.env.ML_SERVICE_URL) {
    console.warn(
        '⚠️  ML_SERVICE_URL not set in .env — falling back to',
        ML_URL
    );
}

async function forecast(lat, lon) {

    const response = await axios.post(
        `${ML_URL}/forecast`,
        {
            latitude: lat,
            longitude: lon
        }
    );

    return response.data;
}

module.exports = {
    forecast
};