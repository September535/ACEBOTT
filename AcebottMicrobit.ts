// AcebottMicrobit.ts
// Microbit car and controller blocks

namespace Acebott {
    export enum RgbLights {
        //% blockId="Right_RGB" block="right"
        Right = 1,
        //% blockId="Left_RGB" block="left"
        Left = 2,
        //% blockId="ALL" block="ALL"
        All = 3
    }
    /**
     * Set LED color.
     */

    //% blockId=colorLight block="set LED %light color $color"
    //% color.shadow="colorNumberPicker"
    //% weight=65
    //% group="Microbit Car"
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
    export function colorLight(light: RgbLights, color: number): void {
        let r: number, g: number, b: number;
        r = (color >> 16) & 0xFF; // 提取红色分量
        g = (color >> 8) & 0xFF;  // 提取绿色分量
        b = color & 0xFF;         // 提取蓝色分量
        singleHeadlights(light, r, g, b); // 调用底层函数设置灯光颜色
    }
    /**
     * Set lamp color R: G: B:.
     */


    //% inlineInputMode=inline
    //% blockId=singleheadlights block="set %light lamp color R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% weight=60
    //% group="Microbit Car"
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
    export function singleHeadlights(light: RgbLights, r: number, g: number, b: number): void {
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
        //% block="forward" enumval=0
        Forward,
        //% block="backward" enumval=1
        Backward,
        //% block="left" enumval=2
        Left,
        //% block="right" enumval=3
        Right
    }
    /**
     * Stop.
     */

    //% blockId=stopcar block="stop"
    //% subcategory="Executive"
    //% group="Microbit Car"
    //% weight=70
    //% help=github:acebott/docs/reference
    export function stopCar(): void {
        let buf = pins.createBuffer(5);
        buf[0] = 0x00;                      //补位
        buf[1] = 0x01;		                //左轮
        buf[2] = 0x00;
        buf[3] = 0;	                        //速度	
        pins.i2cWriteBuffer(0x18, buf);     //数据发送

        buf[1] = 0x02;		                //右轮停止
        pins.i2cWriteBuffer(0x18, buf);     //数据发送
    }
    /**
     * Left wheel speed % Right speed %.
     */

    //% blockId=motors block="left wheel speed %leftspeed\\% | right speed %rightspeed\\%"
    //% leftSpeed.min=-100 leftSpeed.max=100
    //% rightSpeed.min=-100 rightSpeed.max=100
    //% weight=100
    //% group="Microbit Car"
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
    export function motors(leftSpeed: number = 0, rightSpeed: number = 0): void {
        let buf = pins.createBuffer(4);

        // 限制速度范围
        leftSpeed = Math.constrain(leftSpeed, -100, 100);
        rightSpeed = Math.constrain(rightSpeed, -100, 100);

        // 左轮控制
        if (leftSpeed === 0) {
            // 单独停止左轮
            buf[0] = 0x00;
            buf[1] = 0x01;  // 左轮
            buf[2] = 0x00;  // 停止
            buf[3] = 0;     // 速度为0
            pins.i2cWriteBuffer(0x18, buf);
        }
        else if (leftSpeed > 0) {
            buf[0] = 0x00;
            buf[1] = 0x01;  // 左轮
            buf[2] = 0x02;  // 向前
            buf[3] = leftSpeed;
            pins.i2cWriteBuffer(0x18, buf);
        }
        else { // leftSpeed < 0
            buf[0] = 0x00;
            buf[1] = 0x01;  // 左轮
            buf[2] = 0x01;  // 向后
            buf[3] = -leftSpeed; // 取绝对值（~leftSpeed + 1 也可以，但 -leftSpeed 更直观）
            pins.i2cWriteBuffer(0x18, buf);
        }

        // 右轮控制
        if (rightSpeed === 0) {
            // 单独停止右轮
            buf[0] = 0x00;
            buf[1] = 0x02;  // 右轮
            buf[2] = 0x00;  // 停止
            buf[3] = 0;     // 速度为0
            pins.i2cWriteBuffer(0x18, buf);
        }
        else if (rightSpeed > 0) {
            buf[0] = 0x00;
            buf[1] = 0x02;  // 右轮
            buf[2] = 0x02;  // 向前
            buf[3] = rightSpeed;
            pins.i2cWriteBuffer(0x18, buf);
        }
        else { // rightSpeed < 0
            buf[0] = 0x00;
            buf[1] = 0x02;  // 右轮
            buf[2] = 0x01;  // 向后
            buf[3] = -rightSpeed; // 取绝对值
            pins.i2cWriteBuffer(0x18, buf);
        }
    }
    /**
     * Set direction speed.
     */

    //% blockId=c block="set direction %dir | speed %speed"
    //% weight=100
    //% speed.min=0 speed.max=100
    //% group="Microbit Car"
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
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
        //% block="left"
        Left = DAL.MICROBIT_ID_IO_P1,
        //% block="right"
        Right = DAL.MICROBIT_ID_IO_P0
    }
    /**
     * Tracking value.
     */


    //% blockId=tracking block="%pin tracking value"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    //% weight=45
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
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
        X,
        //% block="Y" enumval=1
        Y,
        //% block="key" enumval=2
        Key,
    }
    /**
     * Read joystick value.
     */


    //% blockId=joystick block="read joystick value %dir "
    //% group="Microbit Controller"
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
    export function joystick(dir: Rocker): number | boolean {
        switch (dir) {
            case Rocker.X:
                return pins.analogReadPin(AnalogPin.P1); // 读取摇杆 X 值
            case Rocker.Y:
                return pins.analogReadPin(AnalogPin.P2); // 读取摇杆 Y 值
            case Rocker.Key:
                pins.setPull(DigitalPin.P8, PinPullMode.PullUp); // 设置按键引脚为上拉模式
                return pins.digitalReadPin(DigitalPin.P8) === 0; // 读取按键状态，返回布尔值
            default:
                return false; // 如果传入无效的方向，返回 false
        }
    }

    export enum FourKey {
        //% block="up" enumval=0
        Up,
        //% block="down" enumval=1
        Down,
        //% block="left" enumval=2
        Left,
        //% block="right" enumval=3
        Right
    }
    /**
     * Read the key.
     */

    //% blockId=Four_bit_key block="read the %dir key"
    //% group="Microbit Controller"
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
    export function fourBitKey(dir: FourKey): boolean {
        // 设置引脚的上拉电阻
        pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp)

        // 根据方向读取对应的按键状态
        switch (dir) {
            case FourKey.Up:
                return pins.digitalReadPin(DigitalPin.P16) === 0;
            case FourKey.Down:
                return pins.digitalReadPin(DigitalPin.P14) === 0;
            case FourKey.Left:
                return pins.digitalReadPin(DigitalPin.P13) === 0;
            case FourKey.Right:
                return pins.digitalReadPin(DigitalPin.P15) === 0;
            default:
                return false; // 如果传入无效的方向，返回 false
        }
    }


    export enum VibrationMotorCondition {
        //% block="ON" enumval=0
        On,
        //% block="OFF" enumval=1
        Off,
    }

    // 控制震动电机
    /**
     * Vibrating machine.
     */
    //% blockId=Vibrating_machine block="vibrating machine %condition"
    //% group="Microbit Controller"
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
    export function vibratingMachine(condition: VibrationMotorCondition): void {
        if (condition === VibrationMotorCondition.On) {
            pins.digitalWritePin(DigitalPin.P12, 1); // 打开震动电机
        } else {
            pins.digitalWritePin(DigitalPin.P12, 0); // 关闭震动电机
        }
    }
    // Microbit controller  @end
}


namespace Acebott {
    let stcInit = false
    let stc: AcebottSTC

    function initSTC(): void {
        if (!stcInit) {
            stc = new AcebottSTC()
            stcInit = true
        }
    }

    /**
     * Control a servo through the external STC8H robotic arm controller.
     */
    //% blockId=stcServoAngle block="microbit robotic arm|channel %channel|angle %degree"
    //% channel.min=0 channel.max=5 channel.defl=0
    //% degree.min=0 degree.max=180 degree.defl=90
    //% group="Microbit Controller"
    //% subcategory="Executive"
    //% help=github:acebott/docs/reference
    export function stcServoAngle(channel: number, degree: number): void {
        initSTC()
        stc.setServoAngle(channel, degree)
    }
}
