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

## Micro:bit robotic arm

Initialize the chassis, shoulder, elbow, and claws with four STC controller
channels (or the supported direct micro:bit servo outputs). Each joint starts at
90 degrees. The claws are limited to 90–180 degrees; the other joints use
0–180 degrees.

- `armSetJoint(...)` moves one joint to an angle at a speed from 1 to 100.
- `armMemory(...)` saves, runs, or deletes up to 20 poses in RAM. Saved poses
  are cleared when the micro:bit restarts.
- `armSetPosition(x, y, z)` performs inverse kinematics in centimetres using
  the provisional geometry H=10.5, L1=8.5, and L2=10.9 cm. The conservative
  limits are X=-10–10, Y=5–16, Z=5–20, and radial reach=7–18 cm. Unreachable
  positions are ignored and reported over serial.
- `armGetCoordinate(...)` and `armGetJointAngle(...)` return the current
  calculated position and joint state.
- `armSetJoystick(...)` assigns 0–255 ADC7828 channels to a left or right
  joystick and starts background control. Keep both joysticks centred for about
  one second during setup. Each joystick calibrates its own X/Y centre, uses a
  ±30 dead zone, and moves only the axis with the larger offset to reject
  cross-axis drift. A switch value below 50 is pressed. The left joystick controls chassis/shoulder;
  the right controls elbow/claws. Short-press the left switch to save a pose,
  hold it for three seconds to delete poses, and press the right switch to run
  the saved sequence.

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

