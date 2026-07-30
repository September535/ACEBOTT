# ACEBOTT block reference

The ACEBOTT extension provides MakeCode blocks for educational micro:bit
robotics, smart-home projects, sensors, actuators, and displays. All blocks
appear in the **Acebott** toolbox category.

## Robot car and controller

- `motors(leftSpeed, rightSpeed)` drives both motors from -100% to 100%.
- `stopCar()` stops both motors.
- `moveTime(direction, speed)` drives forward, backward, left, or right.
- `tracking(side)` reads the selected line-tracking sensor.
- `colorLight(...)` and `singleHeadlights(...)` control the car RGB lights.
- `joystick(...)`, `fourBitKey(...)`, and `vibratingMachine(...)` support the
  ACEBOTT micro:bit controller.

## Sensors

- Environmental: DHT11, BMP280, LM35, MQ-4, moisture, rain, sound, light, PIR,
  tilt, and infrared obstacle sensors.
- Distance and position: ultrasonic distance, trace sensors, buttons, and
  joystick inputs.
- Digital buses: BH1745 colour sensor and ADS7828/ADC7828 analogue converter.

Read functions return the raw sensor value unless the block name states a
physical unit. Check the relevant product tutorial for wiring and calibration.

## Actuators

- LEDs, RGB LEDs, relays, lasers, buzzers, vibration motors, and DC motors.
- Direct PWM servos, continuous-rotation servos, and I²C servo channels.

Always check the module voltage and current requirements. Motors and servos
should be powered through the matching ACEBOTT expansion board rather than
directly from a micro:bit GPIO pin.

## Displays and communication

- LED matrix, TM1650 four-digit display, LCD1602, and 128×64 OLED.
- Infrared receiver, RC522 RFID, and UART speech-recognition module.

## Examples

Stop the robot after driving forward for one second:

```blocks
Acebott.motors(50, 50)
basic.pause(1000)
Acebott.stopCar()
```

Read temperature and show it on the micro:bit:

```blocks
let temperature = Acebott.dht11Value(DigitalWritePin.P1, Dht11Type.Celsius)
basic.showNumber(temperature)
```

## Further learning

- [QD024 product and tutorial resources](https://acebott.com/stem-kits/explorer-series/acebott-qd024-smart-car-kit/)
- [QE005/QE006 product and tutorial resources](https://acebott.com/stem-kits/explorer-series/acebott-qe005-micro-bit-smart-home-iot-starter-kit-with-arduino-acecode-scratch/)
- [ACEBOTT kit documentation](https://acebott.com/docs-category/acebott-kit/)

```package
acebott=github:September535/ACEBOTT
```
