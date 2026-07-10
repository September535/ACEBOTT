// tests go here; this will not be compiled when this package is used as an extension.

Acebott.adc7828SetAddress(ADC7828_I2C_ADDRESS.ADDR_0x48)
let adc7828Value = Acebott.adc7828ReadChannel(Acebott.ADC7828Channel.CH0)
basic.showNumber(adc7828Value)

Acebott.moveTime(Acebott.Direction.forward, 0)
Acebott.motors(0, 0)
let microbitCarSpeed = Acebott.tracking(Acebott.MbPins.Left)
let microbitJoystick = Acebott.joystick(Acebott.Rocker.x)
let microbitKey = Acebott.Four_bit_key(Acebott.Four_key.up)
Acebott.Vibrating_machine(Acebott.Vibration_motor_condition.off)
