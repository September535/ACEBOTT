let key = 0
radio.setGroup(23)
radio.setTransmitPower(7)
basic.forever(function () {
    radio.sendValue("X", Acebott.joystick(Acebott.Rocker.X))
    radio.sendValue("Y", Acebott.joystick(Acebott.Rocker.Y))
    if (Acebott.fourBitKey(Acebott.FourKey.Up)) {
        key = 1
    } else if (Acebott.fourBitKey(Acebott.FourKey.Down)) {
        key = 2
    } else if (Acebott.fourBitKey(Acebott.FourKey.Left)) {
        key = 3
    } else if (Acebott.fourBitKey(Acebott.FourKey.Right)) {
        key = 4
    } else {
        key = 0
    }
    radio.sendValue("K", key)
    basic.pause(10)
})
