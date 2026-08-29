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

    const ARM_ADC_LOW = 50
    const ARM_ADC_HIGH = 200

    // Every physical output keeps an independent angle.
    let armOutputAngles = [90, 90, 90, 90, 90, 90, 90, 90]
    let armOutputLastAngles = [-1, -1, -1, -1, -1, -1, -1, -1]

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

    function controlArmJoint(
        adcChannel: Adc7828Channel,
        outputChannel: ArmOutputChannel,
        step: number,
        minAngle: number,
        maxAngle: number,
        reverse: boolean
    ): void {
        let outputIndex = outputChannel
        if (outputIndex < 0 || outputIndex > 7) {
            return
        }

        minAngle = Math.constrain(minAngle, 0, 180)
        maxAngle = Math.constrain(maxAngle, minAngle, 180)

        let adcValue = adc7828ReadChannel(adcChannel)
        let angle = armOutputAngles[outputIndex]

        if (step < 1) {
            step = 1
        }
        if (step > 20) {
            step = 20
        }

        if (adcValue > ARM_ADC_HIGH) {
            if (reverse) {
                angle -= step
            } else {
                angle += step
            }
        } else if (adcValue < ARM_ADC_LOW) {
            if (reverse) {
                angle += step
            } else {
                angle -= step
            }
        }

        angle = Math.constrain(angle, minAngle, maxAngle)
        armOutputAngles[outputIndex] = angle

        if (angle != armOutputLastAngles[outputIndex]) {
            writeArmOutput(outputChannel, angle)
            armOutputLastAngles[outputIndex] = angle
        }
    }

    /**
     * Control a robotic arm joint with the ADC7828 joystick.
     * Put this block inside forever.
     */
    //% blockId=armBaseControl block="robotic arm joint|controller %adcChannel|output %outputChannel|step %step"
    //% adcChannel.defl=Adc7828Channel.CH0
    //% outputChannel.defl=ArmOutputChannel.STC0
    //% step.min=1 step.max=20 step.defl=1
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=90
    //% help=github:acebott/docs/reference
    export function armBaseControl(
        adcChannel: Adc7828Channel,
        outputChannel: ArmOutputChannel,
        step: number
    ): void {
        controlArmJoint(adcChannel, outputChannel, step, 0, 180, false)
    }

    /**
     * Control the robotic arm chassis. Its joystick direction is reversed.
     */
    //% blockId=armChassisControl block="robotic arm chassis|controller %adcChannel|output %outputChannel|step %step"
    //% adcChannel.defl=Adc7828Channel.CH0
    //% outputChannel.defl=ArmOutputChannel.STC0
    //% step.min=1 step.max=20 step.defl=1
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=100
    //% help=github:acebott/docs/reference
    export function chassisControl(
        adcChannel: Adc7828Channel,
        outputChannel: ArmOutputChannel,
        step: number
    ): void {
        controlArmJoint(adcChannel, outputChannel, step, 0, 180, true)
    }

    /**
     * Control the robotic arm shoulder.
     */
    //% blockId=armShoulderControl block="robotic arm shoulder|controller %adcChannel|output %outputChannel|step %step"
    //% adcChannel.defl=Adc7828Channel.CH1
    //% outputChannel.defl=ArmOutputChannel.STC1
    //% step.min=1 step.max=20 step.defl=1
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=95
    //% help=github:acebott/docs/reference
    export function shoulderControl(
        adcChannel: Adc7828Channel,
        outputChannel: ArmOutputChannel,
        step: number
    ): void {
        controlArmJoint(adcChannel, outputChannel, step, 0, 180, false)
    }

    /**
     * Control the robotic arm elbow.
     */
    //% blockId=armElbowControl block="robotic arm elbow|controller %adcChannel|output %outputChannel|step %step"
    //% adcChannel.defl=Adc7828Channel.CH2
    //% outputChannel.defl=ArmOutputChannel.STC2
    //% step.min=1 step.max=20 step.defl=1
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=90
    //% help=github:acebott/docs/reference
    export function elbowControl(
        adcChannel: Adc7828Channel,
        outputChannel: ArmOutputChannel,
        step: number
    ): void {
        controlArmJoint(adcChannel, outputChannel, step, 0, 180, false)
    }

    /**
     * Control the robotic arm claws, limited to 90-180 degrees.
     */
    //% blockId=armClawsControl block="robotic arm claws|controller %adcChannel|output %outputChannel|step %step"
    //% adcChannel.defl=Adc7828Channel.CH3
    //% outputChannel.defl=ArmOutputChannel.STC3
    //% step.min=1 step.max=20 step.defl=1
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=85
    //% help=github:acebott/docs/reference
    export function clawsControl(
        adcChannel: Adc7828Channel,
        outputChannel: ArmOutputChannel,
        step: number
    ): void {
        controlArmJoint(adcChannel, outputChannel, step, 90, 180, false)
    }

}
