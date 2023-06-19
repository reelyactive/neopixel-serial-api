/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const express = require('express');
const SerialManager = require('./serialmanager');
const LedsManager = require('./ledsmanager');


/**
 * NeopixelSerialAPI Class
 * REST API to control NeoPixel strips via a serial link to a microcontroller.
 */
class NeopixelSerialAPI {

  /**
   * NeopixelSerialAPI constructor
   * @param {Object} options The configuration options.
   * @constructor
   */
  constructor(options) {
    let self = this;
    options = options || {};

    if(options.app) {
      configureExpress(options.app, self);
    }

    this.serial = new SerialManager(options);
    this.leds = new LedsManager(options, self.serial);
  }

}


/**
 * Configure the routes of the API.
 * @param {Express} app The Express app.
 * @param {NeopixelSerialAPI} instance The Neopixel serial API instance.
 */
function configureExpress(app, instance) {
  app.use(function(req, res, next) {
    req.neopixelserialapi = instance;
    next();
  });
  app.use('/leds', require('./routes/leds'));
}


module.exports = NeopixelSerialAPI;