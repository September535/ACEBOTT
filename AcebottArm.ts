// AcebottArm.ts
// First robotic-arm block: control the base joint with the ADC7828 joystick.

namespace Acebott {
    /**
     * Output channels for the robotic arm.
     * STC0-STC5 use the external STC controller.
     * P2 and P12 use the micro:bit pins directly.
     */
    export enum ArmOutputChannel {
        //% block="STC0"
        STC0 = 0,
        //% block="STC1"
        STC1 = 1,
        //% block="STC2"
        STC2 = 2,
        //% block="STC3"
        STC3 = 3,
        //% block="STC4"
        STC4 = 4,
        //% block="STC5"
        STC5 = 5,
        //% block="P2"
        MicrobitP2 = 6,
        //% block="P12"
        MicrobitP12 = 7
    }

    const ARM_ADC_LOW = 100
    const ARM_ADC_HIGH = 200

    let armBaseAngle = 90
    let armBaseLastAngle = -1
    let armBaseLastOutput = -1

    function writeArmOutput(channel: ArmOutputChannel, angle: number): void {
        angle = Math.constrain(angle, 0, 180)

        if (channel <= ArmOutputChannel.STC5) {
            stcServoAngle(channel, angle)
        } else if (channel == ArmOutputChannel.MicrobitP2) {
            pins.servoWritePin(AnalogPin.P2, angle)
        } else if (channel == ArmOutputChannel.MicrobitP12) {
            pins.servoWritePin(AnalogPin.P12, angle)
        }
    }

    /**
     * Control the robotic arm base with the ADC7828 joystick.
     * Put this block inside forever.
     */
    //% blockId=armBaseControl block="robotic arm base|controller %adcChannel|output %outputChannel|step %step"
    //% adcChannel.defl=Adc7828Channel.CH0
    //% outputChannel.defl=ArmOutputChannel.STC0
    //% step.min=1 step.max=20 step.defl=1
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=100
    //% help=github:acebott/docs/reference
    export function armBaseControl(
        adcChannel: Adc7828Channel,
        outputChannel: ArmOutputChannel,
        step: number
    ): void {
        let adcValue = adc7828ReadChannel(adcChannel)

        if (step < 1) {
            step = 1
        }
        if (step > 20) {
            step = 20
        }

        if (adcValue > ARM_ADC_HIGH) {
            armBaseAngle += step
        } else if (adcValue < ARM_ADC_LOW) {
            armBaseAngle -= step
        }

        armBaseAngle = Math.constrain(armBaseAngle, 0, 180)

        if (armBaseAngle != armBaseLastAngle || outputChannel != armBaseLastOutput) {
            writeArmOutput(outputChannel, armBaseAngle)
            armBaseLastAngle = armBaseAngle
            armBaseLastOutput = outputChannel
        }
    }
}
