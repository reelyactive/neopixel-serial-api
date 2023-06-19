/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const { SerialPort } = require('serialport');


const BAUDRATE = 9600;
const AUTO_PATH = 'auto';
const AUTO_MANUFACTURER = 'FTDI';


/**
 * SerialManager Class
 * Manages the serial interface for LED control.
 */
class SerialManager {

  /**
   * SerialManager constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};
    let self = this;
    let path = options.path || AUTO_PATH;

    openSerialPort(path, (err, serialPort, path) => {
      if(err) {
        return console.log('neopixel-serial-api: error opening serial port',
                           err.message);
      }
      self.serialPort = serialPort;
      self.path = path;
      // TODO: wait for message from microcontroller before sending data?
    });
  }

  /**
   * Write data on the serial port.
   * @param {Buffer} data The data to write
   * @param {callback} callback Function to call on completion
   */
  write(data, callback) {
    let self = this;
    
    self.serialPort.write(data, (err) => {
      return callback(err);
    });
  }

}


/**
 * Open the serial port based on the given path.
 * @param {String} path Path to serial port, ex: /dev/ttyUSB0 or auto.
 * @param {function} callback The function to call on completion.
 */
function openSerialPort(path, callback) {
  const { SerialPort } = require('serialport');
  let serialPort;

  if(path === AUTO_PATH) {
    let detectedPath;
    SerialPort.list().then(ports => {
      ports.forEach(port => {
        if(port.manufacturer === AUTO_MANUFACTURER) {
          serialPort = new SerialPort({ path: port.path, baudRate: BAUDRATE },
                                      (err) => {
            console.log('neopixel-serial-api: auto serial path: \"' +
                        port.path + '\" was selected');
            return callback(err, serialPort, port.path);
          });
        }
        else if(port.manufacturer) {
          console.log('neopixel-serial-api: alternate serial path: \"' +
                      port.path + '\" is a ' + port.manufacturer +
                      'device.');
        }
      });
      if(!serialPort) {
        return callback( { message: "Can't auto-determine serial port" } );
      }
    });
  }
  else {
    serialPort = new SerialPort({ path: path, baudRate: BAUDRATE }, (err) => {
      return callback(err, serialPort, path);
    });
  }
}


module.exports = SerialManager;
