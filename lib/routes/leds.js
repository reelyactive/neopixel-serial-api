/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const express = require('express');
const responseHandler = require('./responsehandler');


let router = express.Router();

router.route('/')
  .put((req, res) => { updateLeds(req, res); });


/**
 * Update the LEDs configuration
 * @param {Object} req The HTTP request.
 * @param {Object} res The HTTP result.
 */
function updateLeds(req, res) {
  let configuration = req.body;
  let leds = req.neopixelserialapi.leds;
  leds.update(configuration, (status, data) => {
    let response = responseHandler.prepareResponse(req, status, data);
    res.status(status).json(response);
  });
}


module.exports = router;