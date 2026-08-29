// Compile-time API coverage for the ACEBOTT MakeCode extension.
//
// These functions intentionally are not called. PXT type-checks every call,
// while hardware-dependent APIs do not run in the simulator. Follow
// docs/testing.md for simulator and physical-hardware acceptance tests.

function testCarAndControllerApi(): void {
    Acebott.colorLight(Acebott.RgbLights.All, 0x000000)
    Acebott.singleHeadlights(Acebott.RgbLights.Left, 0, 0, 0)
    Acebott.stopCar()
    Acebott.motors(0, 0)
    Acebott.moveTime(Acebott.Direction.Forward, 0)
    let trackingValue = Acebott.tracking(Acebott.MbPins.Left)
    let joystickValue = Acebott.joystick(Acebott.Rocker.X)
    let keyPressed = Acebott.fourBitKey(Acebott.FourKey.Up)
    Acebott.vibratingMachine(Acebott.VibrationMotorCondition.Off)
}

function testSensorApi(): void {
    let light = Acebott.photoresistance(AnalogReadPin.P0)
    let moisture = Acebott.moisture(AnalogReadPin.P0)
    let motion = Acebott.pirMotion(DigitalPin.P0)
    let sound = Acebott.soundSensor(AnalogReadPin.P0)
    let obstacle = Acebott.infraredObstacle(DigitalPin.P0)
    let tilted = Acebott.tiltSensor(DigitalPin.P0)
    let temperature = Acebott.sensorTemperature(AnalogPin.P0)
    let distance = Acebott.ultrasonicDistance(
        DigitalPin.P1,
        DigitalWritePin.P2,
        DistanceUnit.Centimeters
    )
    let pressed = Acebott.isButtonPressed(DigitalReadPin.P0)
    let dht = Acebott.dht11Value(DigitalWritePin.P0, Dht11Type.Celsius)
    let rain = Acebott.raindropSensor(AnalogReadPin.P0)
    let gas = Acebott.mq4Sensor(AnalogReadPin.P0)

    let detectedColor = Acebott.colorDetect()
    let red = Acebott.rgbValue(Acebott.RgbChannel.Red)
    let isRed = Acebott.isColor(Acebott.ColorName.Red)

    Acebott.bmp280SetAddress(Bmp280I2cAddress.Address0x76)
    let bmpTemperature = Acebott.bmp280GetTemperature()
    let pressure = Acebott.bmp280GetPressure()

    Acebott.adc7828SetAddress(Adc7828I2cAddress.Address0x48)
    let adcValue = Acebott.adc7828ReadChannel(Acebott.Adc7828Channel.CH0)

    Acebott.traceSensorInit(
        AnalogReadPin.P0,
        AnalogReadPin.P1,
        AnalogReadPin.P2
    )
    let traceValue = Acebott.traceSensorValue(TraceSensorIndex.L)
}

function testActuatorApi(): void {
    Acebott.setLedBrightness(AnalogWritePin.P0, 0)
    Acebott.setLed(DigitalWritePin.P0, SwitchStatus.Off)
    Acebott.ledMatrixShowHex(0)
    Acebott.servoIic(Servos.Servo1, 90)
    Acebott.servoIo(ServoPin.P0, 90)
    Acebott.servoRunDir(
        ServoPin.P0,
        Acebott.ServoDirection.Clockwise,
        0
    )
    Acebott.servoStop(ServoPin.P0)
    Acebott.setRelay(DigitalWritePin.P0, SwitchStatus.Off)
    Acebott.setRgb(
        AnalogWritePin.P0,
        AnalogWritePin.P1,
        AnalogWritePin.P2,
        0,
        0,
        0
    )
    Acebott.dcMotorRun(Motors.M1, 0)
    Acebott.setLaser(DigitalWritePin.P0, SwitchStatus.Off)
    Acebott.actuatorBuzzer(AnalogPin.P0, 0)
    Acebott.dcMotor130Run(
        AnalogWritePin.P0,
        DigitalWritePin.P1,
        0
    )

    Acebott.rockerPin(AnalogPin.P0, AnalogPin.P1, DigitalPin.P2)
    let rockerX = Acebott.rockerAnalogRead(RockerPinAxis.X)
    let rockerPressed = Acebott.rockerButtonPressed()
}

function testDisplayApi(): void {
    Acebott.tm1650Configure(
        "display",
        DigitalWritePin.P1,
        DigitalWritePin.P0
    )
    Acebott.tm1650ShowString("display", "ACE")
    Acebott.tm1650ShowDecimal("display", 0)
    Acebott.tm1650DisplayOff("display")

    Acebott.lcd1602Init()
    Acebott.lcd1602Clear()
    Acebott.lcd1602ShiftLeft()
    Acebott.lcd1602ShiftRight()
    Acebott.lcd1602ShowString(0, 0, "ACEBOTT")
    Acebott.lcd1602ShowNumber(0, 1, 0)
    let character = Acebott.lcd1602CharacterPixels("0000000000000000")
    Acebott.lcd1602CreateCharacter(CharIndex.C1, character)
    Acebott.lcd1602ShowCharacter(0, 0, CharIndex.C1)

    Acebott.oledShowNumber(0, 0, 0)
    Acebott.oledShowString("ACEBOTT", 0, 0)
    Acebott.oledClearLine(0)
    Acebott.oledClear()
}

function testCommunicationApi(): void {
    Acebott.irReceiverInit(DigitalPin.P0)
    Acebott.irOnButton(IrButton.Any, IrButtonAction.Pressed, function () {})
    let irMatched = Acebott.irIsDecodeResult(IrButton.Any)
    let irReceived = Acebott.irIsReceived()

    Acebott.rfidInit()
    let cardId = Acebott.rfidId()
    let cardData = Acebott.rfidReadData()
    Acebott.rfidWriteToCard("ACEBOTT")

    Acebott.speechRecognitionInit(UartPin.P0)
    let commandMatched = Acebott.speechRecognitionCommand(0)
}

function testRoboticArmApi(): void {
    Acebott.armInitialize(
        Acebott.ArmOutputChannel.STC0,
        Acebott.ArmOutputChannel.STC1,
        Acebott.ArmOutputChannel.STC2,
        Acebott.ArmOutputChannel.STC3
    )
    Acebott.armSetJoint(Acebott.ArmJoint.Chassis, 90, 50)
    Acebott.armMemory(Acebott.ArmMemoryMode.Save)
    Acebott.armMemory(Acebott.ArmMemoryMode.Run)
    Acebott.armMemory(Acebott.ArmMemoryMode.Delete)
    Acebott.armSetPosition(0, 12, 15)
    let x = Acebott.armGetCoordinate(Acebott.ArmCoordinateAxis.X)
    let chassis = Acebott.armGetJointAngle(Acebott.ArmJoint.Chassis)
    Acebott.armSetJoystick(
        Acebott.ArmJoystickSide.Left,
        Acebott.Adc7828Channel.CH0,
        Acebott.Adc7828Channel.CH1,
        Acebott.Adc7828Channel.CH4
    )
}





