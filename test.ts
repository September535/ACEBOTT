// tests go here; this will not be compiled when this package is used as an extension.

Acebott.adc7828SetAddress(Adc7828I2cAddress.Address0x48)
let adc7828Value = Acebott.adc7828ReadChannel(Acebott.Adc7828Channel.CH0)
basic.showNumber(adc7828Value)

Acebott.moveTime(Acebott.Direction.Forward, 0)
Acebott.motors(0, 0)
let microbitCarSpeed = Acebott.tracking(Acebott.MbPins.Left)
let microbitJoystick = Acebott.joystick(Acebott.Rocker.X)
let microbitKey = Acebott.fourBitKey(Acebott.FourKey.Up)
Acebott.vibratingMachine(Acebott.VibrationMotorCondition.Off)
