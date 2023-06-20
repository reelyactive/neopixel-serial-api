/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const HTTP_STATUS_OK = 200;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const TERMINATOR_CHARACTER = '0a';
const CLEAR_COMMAND_BYTE = 'ff';
const SHOW_COMMAND_BYTE = 'aa';


/**
 * StripsManager Class
 * Manages the LED strips.
 */
class StripsManager {

  /**
   * StripsManager constructor
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
   * Update the strip configuration.
   * @param {String} id The strip id
   * @param {Buffer} data The data to write
   * @param {callback} callback Function to call on completion
   */
  update(id, configuration, callback) {
    let self = this;
    let strip = Number.parseInt(id).toString(16).padStart(2, '0');
    let commandsString = createClearCommand(strip);

    if(!Array.isArray(configuration)) {
      return callback(HTTP_STATUS_BAD_REQUEST);
    }

    configuration.forEach((led) => {
      if(led.hasOwnProperty('offset') && led.hasOwnProperty('rgb')) {
        let offset = led.offset.toString(16).padStart(4, '0');
        let rgb = null;

        if(Array.isArray(led.rgb) && (led.rgb.length === 3)) {
          rgb = led.rgb[0].toString(16).padStart(2, '0') +
                led.rgb[1].toString(16).padStart(2, '0') +
                led.rgb[2].toString(16).padStart(2, '0');
        }
        else if((typeof led.rgb === 'string') && (led.rgb.length === 6)) {
          rgb = led.rgb;
        }

        if(rgb) {
          commandsString += strip + offset + rgb + TERMINATOR_CHARACTER;
        }
      }
    });

    commandsString += createShowCommand(strip);

    self.serial.write(Buffer.from(commandsString, 'hex'), (err) => {
      if(err) {
        return callback(HTTP_STATUS_INTERNAL_SERVER_ERROR);
      }
      return callback(HTTP_STATUS_OK, {});
    });
  }

}


/**
 * Create the command to show a single strip.
 * @param {String} strip The strip id as a hexadecimal string
 */
function createShowCommand(strip) {
  return (SHOW_COMMAND_BYTE + strip).padEnd(12, '0') + TERMINATOR_CHARACTER;
}


/**
 * Create the command to clear a single strip.
 * @param {String} strip The strip id as a hexadecimal string
 */
function createClearCommand(strip) {
  return (CLEAR_COMMAND_BYTE + strip).padEnd(12, '0') + TERMINATOR_CHARACTER;
}


module.exports = StripsManager;
