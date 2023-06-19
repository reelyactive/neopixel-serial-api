/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const HTTP_STATUS_OK = 200;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const TERMINATOR_CHARACTER = '0a';
const COMMAND_CLEAR = 'ff0000000000' + TERMINATOR_CHARACTER;
const COMMAND_SHOW = 'aa0000000000' + TERMINATOR_CHARACTER;


/**
 * LedsManager Class
 * Manages the LEDs.
 */
class LedsManager {

  /**
   * LedsManager constructor
   * @param {Object} options The options as a JSON object.
   * @param {SerialManager} serial The serial manager.
   * @constructor
   */
  constructor(options, serial) {
    let self = this;
    options = options || {};
    self.serial = serial;
  }

  /**
   * Update the LED configuration.
   * @param {Buffer} data The data to write
   * @param {callback} callback Function to call on completion
   */
  update(configuration, callback) {
    let self = this;
    let commandsString = COMMAND_CLEAR;

    if(!Array.isArray(configuration)) {
      return callback(HTTP_STATUS_BAD_REQUEST);
    }

    configuration.forEach((element) => {
      if(element.hasOwnProperty('strip') && Array.isArray(element.leds)) {
        let strip = element.strip.toString(16).padStart(2, '0');
        element.leds.forEach((led) => {
          if(led.hasOwnProperty('offset') && led.hasOwnProperty('rgb')) {
            let offset = led.offset.toString(16).padStart(4, '0');
            commandsString += strip + offset + led.rgb + TERMINATOR_CHARACTER;
          }
        });
      }
    });

    commandsString += COMMAND_SHOW;

    self.serial.write(Buffer.from(commandsString, 'hex'), (err) => {
      if(err) {
        return callback(HTTP_STATUS_INTERNAL_SERVER_ERROR);
      }
      return callback(HTTP_STATUS_OK, {});
    });
  }

}


module.exports = LedsManager;
