/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const express = require('express');
const responseHandler = require('./responsehandler');


let router = express.Router();

router.route('/:id')
  .put((req, res) => { updateStrip(req, res); });


/**
 * Update the strip configuration
 * @param {Object} req The HTTP request.
 * @param {Object} res The HTTP result.
 */
function updateStrip(req, res) {
  let id = req.params.id;
  let configuration = req.body;
  let strips = req.neopixelserialapi.strips;

  strips.update(id, configuration, (status, data) => {
    let response = responseHandler.prepareResponse(req, status, data);
    res.status(status).json(response);
  });
}


module.exports = router;