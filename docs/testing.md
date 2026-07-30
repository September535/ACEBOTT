# ACEBOTT extension test plan

Run this plan before every release and after a MakeCode micro:bit target update.

## Automated compile test

1. Install the official PXT micro:bit target.
2. Run `pxt install`.
3. Run `pxt build`.
4. Pass when the command exits successfully with no TypeScript errors.

`test.ts` references the public API families inside compile-only test functions.
Hardware-dependent functions are not executed automatically, so the simulator
must not hang while the compiler still checks their signatures.

## Simulator smoke test

1. Import the repository URL into a clean MakeCode micro:bit project.
2. Confirm the **Acebott** toolbox category opens without errors.
3. Add the car, sensor, actuator, and display blocks used in the examples.
4. Switch between Blocks and JavaScript.
5. Pass when the project converts in both directions and compiles without a
   simulator error.

## Hardware tests

Use both a micro:bit V1 and V2 where available.

### QD024 robot car

1. Verify forward, backward, left, right, and stop at low motor speed.
2. Verify left and right tracking sensors change over black and white surfaces.
3. Verify both RGB lights, ultrasonic distance, IR input, and servo ports.
4. Pass when commands match the requested direction and sensors change
   consistently without resetting the micro:bit.

### QE005/QE006 smart home

1. Verify LEDs, relay, fan/motor, buzzer, and laser outputs.
2. Verify DHT11, PIR, light, moisture, sound, gas, and rain sensor readings.
3. Verify LCD1602/OLED output and any installed I²C modules.
4. Pass when every connected module responds and shared I²C devices do not
   conflict.

Record the micro:bit version, kit version, MakeCode target version, result, and
any wiring differences in the release notes or issue tracker.
