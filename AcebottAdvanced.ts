namespace Acebott {
    // Color sensor related code
    let sugarColorInit = false;
    let sugarColor: SugarColor;

    // OLED 相关代码
    let oledInit = false;
    let oled: AcebottOled;

    // BMP280 相关代码
    let bmp280Init = false;
    let bmp280: AcebottBMP280;

    // ADC7828 related code
    let adc7828Init = false;
    let adc7828: AcebottADC7828;

    function initOLED(): void {
        if (!oledInit) {
            oled = new AcebottOled()
            oledInit = true
        }
    }

    function initBMP280(): void {
        if (!bmp280Init) {
            bmp280 = new AcebottBMP280()
            bmp280Init = true
        }
    }

    function initColor(): void {
        if (!sugarColorInit) {
            sugarColor = new SugarColor()
            sugarColorInit = true
        }
    }


    // RGB通道选择枚举
    export enum RgbChannel {
        //% block="R"
        Red = 0,
        //% block="G"
        Green = 1,
        //% block="B"
        Blue = 2
    }

    // 颜色选择枚举
    export enum ColorName {
        //% block="rojo"
        Red = 0,
        //% block="verde"
        Green = 1,
        //% block="azul"
        Blue = 2,
        //% block="amarillo"
        Yellow = 3,
        //% block="púrpura"
        Purple = 4,
        //% block="cian"
        Cyan = 5,
        //% block="blanco"
        White = 6,
        //% block="negro"
        Black = 7
    }
    /**
     * Color sensor detect color.
     */

    //% blockId=colorDetect block="color sensor detect color"
    //% subcategory="Sensor"
    //% group="Color Sensor -V2"
    //% help=github:acebott/docs/reference
    export function colorDetect(): string {
        initColor()
        return sugarColor.detectColor()
    }
    /**
     * Color sensor get value.
     */

    //% blockId=getRGBValue block=" color sensor get %channel value"
    //% subcategory="Sensor"
    //% group="Color Sensor -V2"
    //% help=github:acebott/docs/reference
    export function rgbValue(channel: RgbChannel): number {
        initColor()
        sugarColor.update()
        switch (channel) {
            case RgbChannel.Red:
                return sugarColor.red
            case RgbChannel.Green:
                return sugarColor.green
            case RgbChannel.Blue:
                return sugarColor.blue
            default:
                return 0
        }
    }
    /**
     * The target is.
     */

    //% blockId=isColor block="the target is %color"
    //% subcategory="Sensor"
    //% group="Color Sensor -V2"
    //% blockGap=8
    //% help=github:acebott/docs/reference
    export function isColor(color: ColorName): boolean {
        initColor()
        let colorStr = ""
        switch (color) {
            case ColorName.Red:
                colorStr = "Rojo"
                break
            case ColorName.Green:
                colorStr = "Verde"
                break
            case ColorName.Blue:
                colorStr = "Azul"
                break
            case ColorName.Yellow:
                colorStr = "Amarillo"
                break
            case ColorName.Purple:
                colorStr = "Púrpura"
                break
            case ColorName.Cyan:
                colorStr = "Cian"
                break
            case ColorName.White:
                colorStr = "Blanco"
                break
            case ColorName.Black:
                colorStr = "Negro"
                break
        }
        let result = sugarColor.checkColor(colorStr)
        let isMatch = result == 1
        serial.writeLine("" + (isMatch ? "true" : "false"))
        return isMatch
    }
    /**
     * OLED show number at X Y.
     */
    //% blockId=oledShowNumber block="OLED show number %num at X %x Y %y"
    //% subcategory="Display"
    //% group="OLED12864-1.3inch Modules"
    //% x.min=0 x.max=127
    //% y.min=0 y.max=63
    //% help=github:acebott/docs/reference
    export function oledShowNumber(num: number, x: number, y: number): void {
        initOLED()
        oled.showNumber(x, y, num)
    }
    /**
     * OLED show string at X Y.
     */

    //% blockId=oledShowString block="OLED show string %str at X %x Y %y"
    //% subcategory="Display"
    //% group="OLED12864-1.3inch Modules"
    //% x.min=0 x.max=127
    //% y.min=0 y.max=63
    //% help=github:acebott/docs/reference
    export function oledShowString(str: string, x: number, y: number,): void {
        initOLED()
        oled.showString(x, y, str)
    }
    /**
     * OLED clear line at Y.
     */

    //% blockId=oledClearLine block="OLED clear line at Y %y"
    //% subcategory="Display"
    //% group="OLED12864-1.3inch Modules"
    //% y.min=0 y.max=63
    //% help=github:acebott/docs/reference
    export function oledClearLine(y: number): void {
        initOLED()
        oled.clearLine(y)
    }
    /**
     * OLED clear screen.
     */

    //% blockId=oledClear block="OLED clear screen"
    //% subcategory="Display"
    //% group="OLED12864-1.3inch Modules"
    //% help=github:acebott/docs/reference
    export function oledClear(): void {
        initOLED()
        oled.clear()
    }

    // BMP280 相关代码
    /**
     * BMP280 get temperature (°C).
     */

    //% blockId=bmp280GetTemperature block="BMP280 get temperature (°C)"
    //% subcategory="Sensor"
    //% group="Barometric Pressure Sensor"
    //% help=github:acebott/docs/reference
    export function bmp280GetTemperature(): number {
        initBMP280()
        let temp = bmp280.getTemperatureFloat()
        // 确保返回两位小数
        return Math.round(temp * 100) / 100
    }
    /**
     * BMP280 get pressure (hPa).
     */

    //% blockId=bmp280GetPressure block="BMP280 get pressure (hpa)"
    //% subcategory="Sensor"
    //% group="Barometric Pressure Sensor"
    //% help=github:acebott/docs/reference
    export function bmp280GetPressure(): number {
        initBMP280()
        let pressure = bmp280.getPressureHpa()
        // 确保返回两位小数
        return Math.round(pressure * 100) / 100
    }
    /**
     * BMP280 set address.
     */

    //% blockId=bmp280SetAddress block="BMP280 set address %addr"
    //% subcategory="Sensor"
    //% group="Barometric Pressure Sensor"
    //% help=github:acebott/docs/reference
    export function bmp280SetAddress(addr: Bmp280I2cAddress): void {
        initBMP280()
        bmp280.setAddress(addr)
    }

    export enum Adc7828Channel {
        //% block="CH0"
        CH0 = 0,
        //% block="CH1"
        CH1 = 1,
        //% block="CH2"
        CH2 = 2,
        //% block="CH3"
        CH3 = 3,
        //% block="CH4"
        CH4 = 4,
        //% block="CH5"
        CH5 = 5,
        //% block="CH6"
        CH6 = 6,
        //% block="CH7"
        CH7 = 7
    }

    function initADC7828(): void {
        if (!adc7828Init) {
            adc7828 = new AcebottADC7828()
            adc7828Init = true
        }
    }
    /**
     * ADC7828 read channel.
     */

    //% blockId=adc7828ReadChannel block="ADC7828 read channel %channel"
    //% subcategory="Sensor"
    //% group="ADC7828 Sensor"
    //% help=github:acebott/docs/reference
    export function adc7828ReadChannel(channel: Adc7828Channel): number {
        initADC7828()
        return adc7828.readChannel(channel)
    }
    /**
     * ADC7828 set address.
     */

    //% blockId=adc7828SetAddress block="ADC7828 set address %addr"
    //% subcategory="Sensor"
    //% group="ADC7828 Sensor"
    //% help=github:acebott/docs/reference
    export function adc7828SetAddress(addr: Adc7828I2cAddress): void {
        initADC7828()
        adc7828.setAddress(addr)
    }
    function acebottI2cProbe(address: number): boolean {
        let probe = pins.createBuffer(0)
        let status = pins.i2cWriteBuffer(address, probe, false)
        return status == 0
    }

    function acebottI2cAddressText(address: number): string {
        let hex = "0123456789ABCDEF"
        return "0x" + hex.charAt((address >> 4) & 0x0F) + hex.charAt(address & 0x0F)
    }

    /**
     * Scan all standard usable 7-bit I2C addresses and print responding addresses to serial.
     */
    //% blockId=i2cAddressRead block="I2C address read"
    //% subcategory="Sensor"
    //% group="I2C Tools"
    //% weight=100
    //% help=github:acebott/docs/reference
    export function i2cAddressRead(): void {
        let found = 0
        serial.writeLine("I2C scan start")

        // 0x00-0x07 and 0x78-0x7F are reserved I2C addresses.
        for (let address = 0x08; address <= 0x77; address++) {
            if (acebottI2cProbe(address)) {
                serial.writeLine("I2C found: " + acebottI2cAddressText(address))
                found += 1
            }
        }

        if (found == 0) {
            serial.writeLine("I2C scan: no device")
        } else {
            serial.writeLine("I2C scan done")
        }
    }

    /**
     * Check the STC servo controller at 0x37 and the selected ADC7828 address.
     */

    //% blockId=i2cInitCheck block="I2C initialization check|ADC address %addr"
    //% addr.defl=Adc7828I2cAddress.Address0x48
    //% subcategory="Sensor"
    //% group="ADC7828 Sensor"
    //% help=github:acebott/docs/reference
    export function i2cInitCheck(addr: Adc7828I2cAddress): boolean {
        initADC7828()
        adc7828.setAddress(addr)

        let stcReady = acebottI2cProbe(0x37)
        let adcReady = acebottI2cProbe(addr)

        if (stcReady && adcReady) {
            serial.writeLine("I2C init OK: STC 0x37, ADC7828")
            return true
        }

        if (!stcReady) {
            serial.writeLine("I2C missing: 0x37")
        }
        if (!adcReady) {
            serial.writeLine("I2C missing: ADC7828")
        }
        serial.writeLine("I2C init failed")
        return false
    }

}
