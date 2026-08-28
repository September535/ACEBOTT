// AcebottSTC.ts
// STC8H I2C servo controller driver.
//
// The STC firmware accepts a two-byte I2C write:
//   [channel] [angle]
// The I2C address is the 7-bit address 0x37.

class AcebottSTC {
    private i2cAddr: number = 0x37

    public setServoAngle(channel: number, degree: number): void {
        if (channel < 0 || channel > 5) {
            return
        }

        if (degree < 0) {
            degree = 0
        }
        if (degree > 180) {
            degree = 180
        }

        let buf = pins.createBuffer(2)
        buf[0] = Math.round(channel)
        buf[1] = Math.round(degree)
        pins.i2cWriteBuffer(this.i2cAddr, buf)
    }
}
