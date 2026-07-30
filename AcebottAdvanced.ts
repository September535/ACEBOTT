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

    //% blockId=colorDetect block="Color sensor detect color"
    //% subcategory="Sensor"
    //% group="Color Sensor -V2"
    export function colorDetect(): string {
        initColor()
        return sugarColor.detectColor()
    }

    //% blockId=getRGBValue block=" Color sensor get %channel value"
    //% subcategory="Sensor"
    //% group="Color Sensor -V2"
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

    //% blockId=isColor block="The target is %color"
    //% subcategory="Sensor"
    //% group="Color Sensor -V2"
    //% blockGap=8
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
    //% blockId=oledShowNumber block="OLED show number %num at X %x Y %y"
    //% subcategory="Display"
    //% group="OLED12864-1.3inch Modules"
    //% x.min=0 x.max=127
    //% y.min=0 y.max=63
    export function oledShowNumber(num: number, x: number, y: number): void {
        initOLED()
        oled.showNumber(x, y, num)
    }

    //% blockId=oledShowString block="OLED show string %str at X %x Y %y"
    //% subcategory="Display"
    //% group="OLED12864-1.3inch Modules"
    //% x.min=0 x.max=127
    //% y.min=0 y.max=63
    export function oledShowString(str: string, x: number, y: number,): void {
        initOLED()
        oled.showString(x, y, str)
    }

    //% blockId=oledClearLine block="OLED clear line at Y %y"
    //% subcategory="Display"
    //% group="OLED12864-1.3inch Modules"
    //% y.min=0 y.max=63
    export function oledClearLine(y: number): void {
        initOLED()
        oled.clearLine(y)
    }

    //% blockId=oledClear block="OLED clear screen"
    //% subcategory="Display"
    //% group="OLED12864-1.3inch Modules"
    export function oledClear(): void {
        initOLED()
        oled.clear()
    }

    // BMP280 相关代码

    //% blockId=bmp280GetTemperature block="BMP280 get temperature (°C)"
    //% subcategory="Sensor"
    //% group="Barometric Pressure Sensor"
    export function bmp280GetTemperature(): number {
        initBMP280()
        let temp = bmp280.getTemperatureFloat()
        // 确保返回两位小数
        return Math.round(temp * 100) / 100
    }

    //% blockId=bmp280GetPressure block="BMP280 get pressure (hPa)"
    //% subcategory="Sensor"
    //% group="Barometric Pressure Sensor"
    export function bmp280GetPressure(): number {
        initBMP280()
        let pressure = bmp280.getPressureHpa()
        // 确保返回两位小数
        return Math.round(pressure * 100) / 100
    }

    //% blockId=bmp280SetAddress block="BMP280 set address %addr"
    //% subcategory="Sensor"
    //% group="Barometric Pressure Sensor"
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

    //% blockId=adc7828ReadChannel block="ADC7828 read channel %channel"
    //% subcategory="Sensor"
    //% group="ADC7828 Sensor"
    export function adc7828ReadChannel(channel: Adc7828Channel): number {
        initADC7828()
        return adc7828.readChannel(channel)
    }

    //% blockId=adc7828SetAddress block="ADC7828 set address %addr"
    //% subcategory="Sensor"
    //% group="ADC7828 Sensor"
    export function adc7828SetAddress(addr: Adc7828I2cAddress): void {
        initADC7828()
        adc7828.setAddress(addr)
    }
}
