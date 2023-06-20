/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


// Dependencies
#include <Adafruit_NeoPixel.h>

// Constants
#define STRIP_0_LED_PIN   2
#define STRIP_1_LED_PIN   4
#define STRIP_2_LED_PIN   6
#define STRIP_0_LED_COUNT 30
#define STRIP_1_LED_COUNT 30
#define STRIP_2_LED_COUNT 30
#define BAUD_RATE 9600
#define TERMINATOR_CHARACTER '\n'
#define MESSAGE_LENGTH 6

// Global variables
byte message[MESSAGE_LENGTH];
Adafruit_NeoPixel strip0(STRIP_0_LED_COUNT, STRIP_0_LED_PIN,
                         NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel strip1(STRIP_1_LED_COUNT, STRIP_1_LED_PIN,
                         NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel strip2(STRIP_2_LED_COUNT, STRIP_2_LED_PIN,
                         NEO_GRB + NEO_KHZ800);

// Run once on startup
void setup() {
  strip0.begin();          // Initialise NeoPixel strip objects
  strip1.begin();
  strip2.begin();
  strip0.show();           // Turn OFF all pixels
  strip1.show();
  strip2.show();
  
  Serial.begin(BAUD_RATE); // Initialise serial over USB
  while(!Serial);          // Wait until serial over USB is ready
  Serial.println("NanoPixel ready");
}

// Run continuously
void loop() {
  handleSerialMessage();
}

// Handle a serial message with NeoPixel instructions
void handleSerialMessage() {
  if(Serial.available())
  {
    int messageLength = Serial.readBytesUntil(TERMINATOR_CHARACTER, message,
                                              MESSAGE_LENGTH);
    if(messageLength == MESSAGE_LENGTH) {
      int offset = (message[1] * 256 + message[2]);
      switch(message[0]) {
        case 0x00: // Strip 0
          if(offset < STRIP_0_LED_COUNT) {
            strip0.setPixelColor(offset, strip0.Color(message[3],
                                                      message[4],
                                                      message[5]));
          }
          break;
        case 0x01: // Strip 1
          if(offset < STRIP_1_LED_COUNT) {
            strip1.setPixelColor(offset, strip1.Color(message[3],
                                                      message[4],
                                                      message[5]));
          }
          break;
        case 0x02: // Strip 2
          if(offset < STRIP_2_LED_COUNT) {
            strip2.setPixelColor(offset, strip2.Color(message[3],
                                                      message[4],
                                                      message[5]));
          }
          break;
        case 0xaa: // Show
          if((message[1] == 0x00) || (message[1] == 0xff)) {
            strip0.show();
          }
          if((message[1] == 0x01) || (message[1] == 0xff)) {
            strip1.show();
          }
          if((message[1] == 0x02) || (message[1] == 0xff)) {
            strip2.show();
          }
          break;
        case 0xff: // Clear
          if((message[1] == 0x00) || (message[1] == 0xff)) {
            strip0.clear();
          }
          if((message[1] == 0x01) || (message[1] == 0xff)) {
            strip1.clear();
          }
          if((message[1] == 0x02) || (message[1] == 0xff)) {
            strip2.clear();
          }
          break;
      }
    }
  }
}
