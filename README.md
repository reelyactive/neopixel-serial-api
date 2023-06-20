neopixel-serial-api
===================

REST API to control NeoPixel strips via a serial link to a microcontroller.


Quick Start
-----------

Clone this repository, install package dependencies with `npm install`, and then from the root folder run at any time:

    npm start

__neopixel-serial-api__ will attempt to connect with a microcontroller at 9600 baud on a serial/USB link, and accept requests to configure via API any LED strips connected to that microcontroller.


REST API
--------

__neopixel-serial-api__'s REST API includes the following base route:
- /strips _for the configuration of a given LED strip_

### PUT /strips/{id}

Update the configuration of the strip with the given _id_.

#### Example request

| Method | Route     | Content-Type     |
|:-------|:----------|:-----------------|
| PUT    | /strips/0 | application/json |

    [
      { "offset": 0, "rgb": "0770a2" },
      { "offset": 1, "rgb": [ 7, 112, 162 ] }
    ]

#### Example response

    {
      "_meta": {
        "message": "ok",
        "statusCode": 200
      },
      "_links": {
        "self": {
          "href": "http://localhost:3001/strips/0/"
        }
      }
    }


### PUT /strips/{id}/{offset}

Update the configuration of the LED with the given _offset_ in the strip with the given _id_.

#### Example request

| Method | Route       | Content-Type     |
|:-------|:------------|:-----------------|
| PUT    | /strips/0/0 | application/json |

    {
      "rgb": "0770a2"
    }

#### Example response

    {
      "_meta": {
        "message": "ok",
        "statusCode": 200
      },
      "_links": {
        "self": {
          "href": "http://localhost:3001/strips/0/0/"
        }
      }
    }


Serial Protocol
---------------

__neopixel-serial-api__ translates API requests into serial messages, according to the following protocol, which can easily be interpreted by resource-constrained microcontrollers and transformed into neopixel commands using existing libraries.

Each serial message is 6 bytes long, as specified in the following table, and terminated with a newline character ('\n').

| Byte offset | Description                                      |
|:------------|:-------------------------------------------------|
| 0           | Strip id (0 to 127) or special command (128-255) |
| 1           | MSB of LED offset                                |
| 2           | LSB of LED offset                                |
| 3           | Red intensity (0 to 255)                         |
| 4           | Green intensity (0 to 255)                       |
| 5           | Blue intensity (0 to 255)                        |

The following special commands are supported:
- 0xaa: _display the current configuration_
- 0xff: _clear the current configuration_

For example, to clear strip 0 and make the first three LEDs red, green and blue, respectively, the serial message sequence, as hexadecimal strings, would be as follows:

    ff00000000000a
    000000ff00000a
    00000100ff000a
    0000020000ff0a
    aa00000000000a

The seventh byte in each message above is the newline character (0x0a).


License
-------

MIT License

Copyright (c) 2023 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.