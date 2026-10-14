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
90 degrees. Chassis and shoulder use 0–180 degrees; claws use 90–180 degrees.
Claw targets below 90 degrees are clamped to 90, and targets above 180 to 180.
This applies to joint and pose control, joystick control, and the configured
claw output used by armSetOutput. The elbow is limited to 0–120 degrees, with
an additional shoulder/elbow safety constraint.

- `armSetJoint(...)` moves one joint to an angle at a speed from 1 to 100.
- `armReset()` moves the four configured joints to 90 degrees at the current
  speed and makes that
  pose XYZ=(0,0,0). Subsequent XYZ commands and coordinate reads use this
  relative origin; `armInitialize(...)` restores the original coordinate frame.
  Output labels are `servo0` to `servo7`; channel enum values are unchanged.
- `armSetSpeed(...)` selects slow, medium, or fast movement. Set the speed
  immediately before `armReset()` to select its smooth return speed.
- `armClaw(...)` opens to 150 degrees or closes to 90 degrees.
- `armHomePose()` returns all four joints to 90 degrees while preserving the
  existing XYZ origin. In APP mode it uses the APP action scheduler.
- `armMemory(...)` saves, runs, or deletes up to 20 poses in RAM. With
  `armAppPrepare()` and repeated `armAppUpdate()`, the same block also supports
  three memory groups, recording, loop playback, and stopping. Saved poses are
  cleared when the micro:bit restarts.
- `armSetPosition(x, y, z)` uses the supplied IK-v1 conversion and measured
  corrections directly, with H=8, L1=7, L2=12 cm, ten calibration poses, yaw,
  ground-reach and Z=2 interpolation. The existing block and three-argument API
  are retained. The current claw angle is preserved.
- Before reset, XYZ uses the same base coordinate frame as the serial program.
  After `armReset()`, XYZ is relative to the modeled home pose. Reinitialize
  the arm to restore the original frame.
- Original-frame input checks are X=-19..19, Y=0..19, Z=0..27 cm and shoulder-to-
  target distance=8..19 cm. Joint limits and every interpolated step are checked
  before moving; rejected targets do not start motion. Motion follows joint
  angle interpolation with the serial program's effective 20 ms step interval.
- `armGetCoordinate(...)` uses recorded XYZ when the cached joint angles match a
  measured pose; elsewhere it returns a geometric estimate using the same
  nominal dimensions and zero offsets. It does not measure actual position or
  exactly invert all empirical corrections. `armGetJointAngle(...)` returns
  cached target angles.
- For example, `(0,13,2)` retains C=90, S=32, E=87 from the serial program.
  From the initialized 90-degree pose, `(0,10,10)` computes C=90, S=93, E=120
  and passes the joint and path checks with the 120-degree elbow limit.
  `(0,10,11)` computes C=90, S=97, E=118 in the model.
- `armSetJoystick(...)` assigns 0–255 ADC7828 channels to a left or right
  joystick and starts background control. Values below 50 and above 250 are
  treated as movement; a switch value below 50 is pressed. The left joystick controls chassis/shoulder;
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

