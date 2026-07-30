# acebott

Microsoft MakeCode extension for BBC micro:bit and ACEBOTT hardware modules.

This package provides blocks for common sensors, actuators, displays, and
ACEBOTT micro:bit car hardware.

## Installation

1. Open [Microsoft MakeCode for micro:bit](https://makecode.microbit.org/).
2. Create a new project and select **Extensions**.
3. Paste this repository URL into the search box:

```text
https://github.com/September535/ACEBOTT
```

4. Select **acebott** to add the extension.

## Quick start

```blocks
Acebott.motors(50, 50)
basic.pause(1000)
Acebott.stopCar()
```

## Block API

All public blocks are grouped under the `Acebott` category.

### micro:bit car

| API | Purpose |
| --- | --- |
| `motors(leftSpeed, rightSpeed)` | Run the left and right motors from -100% to 100%. |
| `stopCar()` | Stop both motors. |
| `moveTime(direction, speed)` | Move in a selected direction at the requested speed. |
| `tracking(side)` | Read the left or right line-tracking sensor. |
| `joystick(axis)` | Read the joystick X, Y, or button value. |
| `fourBitKey(key)` | Read one of the four directional keys. |
| `vibratingMachine(condition)` | Turn the vibration motor on or off. |
| `colorLight(light, color)` | Set a car RGB light to a packed RGB color. |
| `singleHeadlights(light, red, green, blue)` | Set a car light with RGB components. |

### Sensors

| API | Purpose |
| --- | --- |
| `ultrasonicDistance(echo, trig, unit)` | Measure ultrasonic distance in centimetres or inches. |
| `dht11Value(pin, type)` | Read temperature or humidity from a DHT11 sensor. |
| `photoresistance(pin)` | Read ambient light level. |
| `moisture(pin)` | Read a soil-moisture sensor. |
| `pirMotion(pin)` | Read a PIR motion sensor. |
| `soundSensor(pin)` | Read a sound sensor. |
| `infraredObstacle(pin)` | Read an infrared obstacle sensor. |
| `tiltSensor(pin)` | Read a tilt sensor. |
| `raindropSensor(pin)` | Read a raindrop sensor. |
| `mq4Sensor(pin)` | Read an MQ-4 gas sensor. |
| `bmp280GetTemperature()` | Read BMP280 temperature in degrees Celsius. |
| `bmp280GetPressure()` | Read BMP280 pressure in hPa. |
| `adc7828ReadChannel(channel)` | Read an ADS7828/ADC7828 analogue channel. |
| `colorDetect()` | Return the detected colour and RGB readings. |

### Actuators

| API | Purpose |
| --- | --- |
| `setLed(pin, state)` | Turn an LED on or off. |
| `setLedBrightness(pin, value)` | Set LED brightness from 0 to 100. |
| `setRelay(pin, state)` | Turn a relay on or off. |
| `setLaser(pin, state)` | Turn a laser module on or off. |
| `setRgb(redPin, greenPin, bluePin, red, green, blue)` | Control an RGB LED. |
| `servoIic(channel, degree)` | Set an I²C servo angle. |
| `servoIo(pin, degree)` | Set a directly connected servo angle. |
| `servoRunDir(pin, direction, speed)` | Run a continuous-rotation servo. |
| `servoStop(pin)` | Stop a continuous-rotation servo. |
| `dcMotorRun(motor, speed)` | Run a DC motor. |

### Displays and communication

| API family | Purpose |
| --- | --- |
| `ledMatrixShowHex(...)` | Display a hexadecimal bitmap on the micro:bit LED matrix. |
| `tm1650_*` | Configure and write a TM1650 four-digit display. |
| `LCD1602_*` | Configure and write an LCD1602 display. |
| `oledShow*`, `oledClear*` | Write to and clear a 128×64 OLED display. |
| `IR_*`, `irReceiverInit(...)` | Receive and decode infrared remote-control data. |
| `RFID_*` | Initialise, read, and write an RC522 RFID module. |
| `Speech_Recognition_*` | Initialise and read the speech-recognition module. |

## Hardware notes

- Check the module voltage and pin assignment before connecting hardware.
- I²C modules can share the bus only when their addresses do not conflict.
- Some blocks are intended for specific ACEBOTT kits and may require the
  matching expansion board.

## Development and validation

The package targets MakeCode for micro:bit. Before publishing a release:

1. Run `pxt install`.
2. Run `pxt deploy` and confirm that `test.ts` compiles.
3. Import the package into a clean MakeCode project and verify Blocks and
   JavaScript views.
4. Create a semantic-version release such as `v0.0.1`.

## License

MIT. See [LICENSE.txt](LICENSE.txt).

for PXT/microbit
