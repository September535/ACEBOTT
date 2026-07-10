// AcebottMicrobit.ts
// Microbit car and controller blocks

namespace Acebott {
    export enum RGBLights {
        //% blockId="Right_RGB" block="Right"
        RGB_R = 1,
        //% blockId="Left_RGB" block="Left"
        RGB_L = 2,
        //% blockId="ALL" block="ALL"
        ALL = 3
    }

    //% blockId=colorLight block="Set LED %light color $color"
    //% color.shadow="colorNumberPicker"
    //% weight=65
    //% group="Microbit Car"
    //% subcategory="Executive"
    export function colorLight(light: RGBLights, color: number): void {
        let r: number, g: number, b: number;
        r = (color >> 16) & 0xFF; // 提取红色分量
        g = (color >> 8) & 0xFF;  // 提取绿色分量
        b = color & 0xFF;         // 提取蓝色分量
        singleheadlights(light, r, g, b); // 调用底层函数设置灯光颜色
    }


    //% inlineInputMode=inline
    //% blockId=singleheadlights block="Set %light lamp color R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% weight=60
    //% group="Microbit Car"
    //% subcategory="Executive"
    export function singleheadlights(light: RGBLights, r: number, g: number, b: number): void {
        let buf = pins.createBuffer(5);

        buf[0] = 0x00;
        buf[2] = r;
        buf[3] = g;
        buf[4] = b;

        if (light == 1) {
            buf[1] = 0x03;
            pins.i2cWriteBuffer(0x18, buf);
            basic.pause(10);
        }
        else if (light == 2) {
            buf[1] = 0x04;
            pins.i2cWriteBuffer(0x18, buf);
            basic.pause(10);
        }
        else if (light == 3) {
            buf[1] = 0x05;
            pins.i2cWriteBuffer(0x18, buf);
        }
    }

    // Microbit Car  @start

    export enum Direction {
        //% block="Forward" enumval=0
        forward,
        //% block="Backward" enumval=1
        backward,
        //% block="Left" enumval=2
        left,
        //% block="Right" enumval=3
        right
    }

    //% blockId=stopcar block="Stop"
    //% subcategory="Executive"
    //% group="Microbit Car"
    //% weight=70
    export function stopcar(): void {
        let buf = pins.createBuffer(5);
        buf[0] = 0x00;                      //补位
        buf[1] = 0x01;		                //左轮
        buf[2] = 0x00;
        buf[3] = 0;	                        //速度	
        pins.i2cWriteBuffer(0x18, buf);     //数据发送

        buf[1] = 0x02;		                //右轮停止
        pins.i2cWriteBuffer(0x18, buf);     //数据发送
    }

    //% blockId=motors block="Left wheel speed %lspeed\\% | Right speed %rspeed\\%"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
    //% weight=100
    //% group="Microbit Car"
    //% subcategory="Executive"
    export function motors(lspeed: number = 0, rspeed: number = 0): void {
        let buf = pins.createBuffer(4);

        // 限制速度范围
        lspeed = Math.constrain(lspeed, -100, 100);
        rspeed = Math.constrain(rspeed, -100, 100);

        // 左轮控制
        if (lspeed === 0) {
            // 单独停止左轮
            buf[0] = 0x00;
            buf[1] = 0x01;  // 左轮
            buf[2] = 0x00;  // 停止
            buf[3] = 0;     // 速度为0
            pins.i2cWriteBuffer(0x18, buf);
        }
        else if (lspeed > 0) {
            buf[0] = 0x00;
            buf[1] = 0x01;  // 左轮
            buf[2] = 0x02;  // 向前
            buf[3] = lspeed;
            pins.i2cWriteBuffer(0x18, buf);
        }
        else { // lspeed < 0
            buf[0] = 0x00;
            buf[1] = 0x01;  // 左轮
            buf[2] = 0x01;  // 向后
            buf[3] = -lspeed; // 取绝对值（~lspeed + 1 也可以，但 -lspeed 更直观）
            pins.i2cWriteBuffer(0x18, buf);
        }

        // 右轮控制
        if (rspeed === 0) {
            // 单独停止右轮
            buf[0] = 0x00;
            buf[1] = 0x02;  // 右轮
            buf[2] = 0x00;  // 停止
            buf[3] = 0;     // 速度为0
            pins.i2cWriteBuffer(0x18, buf);
        }
        else if (rspeed > 0) {
            buf[0] = 0x00;
            buf[1] = 0x02;  // 右轮
            buf[2] = 0x02;  // 向前
            buf[3] = rspeed;
            pins.i2cWriteBuffer(0x18, buf);
        }
        else { // rspeed < 0
            buf[0] = 0x00;
            buf[1] = 0x02;  // 右轮
            buf[2] = 0x01;  // 向后
            buf[3] = -rspeed; // 取绝对值
            pins.i2cWriteBuffer(0x18, buf);
        }
    }

    //% blockId=c block="Set direction %dir | speed %speed"
    //% weight=100
    //% speed.min=0 speed.max=100
    //% group="Microbit Car"
    //% subcategory="Executive"
    export function moveTime(dir: Direction, speed: number = 50): void {

        let buf = pins.createBuffer(5);
        if (dir == 0) {
            buf[0] = 0x00;
            buf[1] = 0x01;
            buf[2] = 0x02;
            buf[3] = speed;
            pins.i2cWriteBuffer(0x18, buf);

            buf[1] = 0x02;
            pins.i2cWriteBuffer(0x18, buf);
        }
        if (dir == 1) {
            buf[0] = 0x00;
            buf[1] = 0x01;
            buf[2] = 0x01;
            buf[3] = speed;
            pins.i2cWriteBuffer(0x18, buf);

            buf[1] = 0x02;
            pins.i2cWriteBuffer(0x18, buf);
        }
        if (dir == 2) {
            buf[0] = 0x00;
            buf[1] = 0x01;
            buf[2] = 0x01;
            buf[3] = speed;
            pins.i2cWriteBuffer(0x18, buf);

            buf[1] = 0x02;
            buf[2] = 0x02;
            pins.i2cWriteBuffer(0x18, buf);
        }
        if (dir == 3) {
            buf[0] = 0x00;
            buf[1] = 0x01;
            buf[2] = 0x02;
            buf[3] = speed;
            pins.i2cWriteBuffer(0x18, buf);

            buf[1] = 0x02;
            buf[2] = 0x01;
            pins.i2cWriteBuffer(0x18, buf);

        }

    }


    // Microbit Car  @start

    let _initEvents = true

    export enum MbPins {
        //% block="Left" 
        Left = DAL.MICROBIT_ID_IO_P1,
        //% block="Right" 
        Right = DAL.MICROBIT_ID_IO_P0
    }


    //% blockId=tracking block="%pin tracking value"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    //% weight=45
    //% subcategory="Executive"
    export function tracking(side: MbPins): number {
        pins.setPull(AnalogReadWritePin.P0, PinPullMode.PullUp);
        pins.setPull(AnalogReadWritePin.P1, PinPullMode.PullUp);
        let left_tracking = pins.analogReadPin(AnalogReadWritePin.P1);
        let right_tracking = pins.analogReadPin(AnalogReadWritePin.P0);

        if (side == MbPins.Left) {
            return left_tracking;
        }
        else if (side == MbPins.Right) {
            return right_tracking;
        }
        else {
            return 0;
        }
    }
    // Microbit Car  @end

    // Microbit controller  @start

    export enum Rocker {
        //% block="X" enumval=0
        x,
        //% block="Y" enumval=1
        y,
        //% block="Key" enumval=2
        key,
    }


    //% blockId=joystick block="Read joystick value %dir "
    //% group="Microbit Controller"
    //% subcategory="Executive"
    export function joystick(dir: Rocker): number | boolean {
        switch (dir) {
            case Rocker.x:
                return pins.analogReadPin(AnalogPin.P1); // 读取摇杆 X 值
            case Rocker.y:
                return pins.analogReadPin(AnalogPin.P2); // 读取摇杆 Y 值
            case Rocker.key:
                pins.setPull(DigitalPin.P8, PinPullMode.PullUp); // 设置按键引脚为上拉模式
                return pins.digitalReadPin(DigitalPin.P8) === 0; // 读取按键状态，返回布尔值
            default:
                return false; // 如果传入无效的方向，返回 false
        }
    }

    export enum Four_key {
        //% block="Up" enumval=0
        up,
        //% block="Down" enumval=1
        down,
        //% block="Left" enumval=2
        left,
        //% block="Right" enumval=3
        right
    }

    //% blockId=Four_bit_key block="Read the %dir key"
    //% group="Microbit Controller"
    //% subcategory="Executive"
    export function Four_bit_key(dir: Four_key): boolean {
        // 设置引脚的上拉电阻
        pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp)

        // 根据方向读取对应的按键状态
        switch (dir) {
            case Four_key.up:
                return pins.digitalReadPin(DigitalPin.P16) === 0;
            case Four_key.down:
                return pins.digitalReadPin(DigitalPin.P14) === 0;
            case Four_key.left:
                return pins.digitalReadPin(DigitalPin.P13) === 0;
            case Four_key.right:
                return pins.digitalReadPin(DigitalPin.P15) === 0;
            default:
                return false; // 如果传入无效的方向，返回 false
        }
    }


    export enum Vibration_motor_condition {
        //% block="ON" enumval=0
        on,
        //% block="OFF" enumval=1
        off,
    }

    // 控制震动电机
    //% blockId=Vibrating_machine block="Vibrating machine %condition"
    //% group="Microbit Controller"
    //% subcategory="Executive"
    export function Vibrating_machine(condition: Vibration_motor_condition): void {
        if (condition === Vibration_motor_condition.on) {
            pins.digitalWritePin(DigitalPin.P12, 1); // 打开震动电机
        } else {
            pins.digitalWritePin(DigitalPin.P12, 0); // 关闭震动电机
        }
    }
    // Microbit controller  @end
}
