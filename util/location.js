const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = require('../idpwd');;

async function getCoordsForAddress(address) {
  const sendString = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY.API_KEY}`;

  const response =
    await axios.get(sendString);

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError('Could not find location for the specified address.', 422);
    throw error;
  }

  coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
