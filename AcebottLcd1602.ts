namespace Acebott {
    // LCD1602 @start
    let i2cAddr: number // 0x27: PCF8574
    let BK: number      // backlight control
    let RS: number      // command/data
    let Custom_Char: number[][] = []

    // set LCD reg
    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
    }

    // send data to I2C bus
    function set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        setreg(d)
        setreg(d + 4)
        setreg(d)
    }

    // send command
    function cmd(d: number) {
        RS = 0
        set(d)
        set(d << 4)
    }

    // send data
    function dat(d: number) {
        RS = 1
        set(d)
        set(d << 4)
    }
    /**
     * LCD1602 clear screen.
     */

    //% blockId="LCD1602_Clear" block="LCD1602 clear screen"
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602Clear(): void {
        cmd(0x01)
    }
    /**
     * LCD1602 shift left.
     */

    //% blockId="LCD1602_shl" block="LCD1602 shift left"
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602ShiftLeft(): void {
        cmd(0x18)
    }
    /**
     * LCD1602 shift right.
     */

    //% blockId="LCD1602_shr" block="LCD1602 shift right"
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602ShiftRight(): void {
        cmd(0x1C)
    }
    /**
     * LCD1602 create custom character.
     */

    //% blockId="LCD1602_Makecharacter"
    //% block="LCD1602 create custom character %characterindex|%im"
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602CreateCharacter(characterIndex: CharIndex, im: Image): void {
        const customChar = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 5; x++) {
                if (im.pixel(x, y)) {
                    customChar[y] |= 1 << (4 - x)
                }
            }
        }
        Custom_Char[characterIndex] = customChar;
    }
    /**
     * Custom character.
     */

    //% blockId="LCD1602_Characterpixels"
    //% block="custom character"
    //% imageLiteral=1
    //% imageLiteralColumns=5
    //% imageLiteralRows=8
    //% imageLiteralScale=0.6
    //% shim=images::createImage
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602CharacterPixels(i: string): Image {
        return <Image><any>i;
    }
    /**
     * LCD1602 at (x: ,y: ) show custom character.
     */


    //% blockId="LCD1602_Showchararacter"
    //% block="LCD1602 at (x:|%x|,y:|%y) show custom character|%characterindex"
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602ShowCharacter(x: number, y: number, characterIndex: CharIndex): void {
        let a: number
        if (y > 0)
            a = 0xC0
        else
            a = 0x80
        a += x
        cmd(0x40 | (characterIndex << 3));
        for (let y = 0; y < 8; y++) {
            dat(Custom_Char[characterIndex][y]);
        }
        cmd(a)
        dat(characterIndex)

    }
    /**
     * LCD1602 at (x: ,y: ) show string.
     */

    //% blockId="LCD1602_ShowString" block="LCD1602 at (x:|%x|,y:|%y) show string|%s|"
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% s.defl="Hello,Acebott!"
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602ShowString(x: number, y: number, s: string): void {
        let a: number

        if (y > 0)
            a = 0xC0
        else
            a = 0x80
        a += x
        cmd(a)

        for (let i = 0; i < s.length; i++) {
            dat(s.charCodeAt(i))
        }
    }
    /**
     * LCD1602 at (x: ,y: ) show number.
     */

    //% blockId="LCD16202_ShowNumber" block="LCD1602 at (x:|%x|,y:|%y) show number|%n|"
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602ShowNumber(x: number, y: number, n: number): void {
        let s = n.toString()
        lcd1602ShowString(x, y, s)
    }
    /**
     * LCD1602 initialization.
     */

    //% blockId="LCD1602_Init" block="LCD1602 initialization"
    //% subcategory="Display"
    //% group="LCD1602 Modules"
    //% help=github:acebott/docs/reference
    export function lcd1602Init(): void {
        i2cAddr = 39
        BK = 8
        RS = 0
        cmd(0x33)       // set 4bit mode
        basic.pause(5)
        set(0x30)
        basic.pause(5)
        set(0x20)
        basic.pause(5)
        cmd(0x28)       // set mode
        cmd(0x0C)
        cmd(0x06)
        cmd(0x01)       // clear
    }
    // LCD1602 @end
}
