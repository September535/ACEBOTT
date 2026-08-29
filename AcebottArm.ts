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

    /** Robotic-arm joints. */
    export enum ArmJoint {
        //% block="chassis"
        Chassis = 0,
        //% block="shoulder"
        Shoulder = 1,
        //% block="elbow"
        Elbow = 2,
        //% block="claws"
        Claws = 3
    }

    /** Actions for the in-memory pose recorder. */
    export enum ArmMemoryMode {
        //% block="save"
        Save = 0,
        //% block="run"
        Run = 1,
        //% block="delete"
        Delete = 2
    }

    /** Cartesian coordinate axes. */
    export enum ArmCoordinateAxis {
        //% block="X"
        X = 0,
        //% block="Y"
        Y = 1,
        //% block="Z"
        Z = 2
    }

    /** Left or right ADC7828 joystick. */
    export enum ArmJoystickSide {
        //% block="left"
        Left = 0,
        //% block="right"
        Right = 1
    }

    const ARM_BASE_HEIGHT = 8
    const ARM_SHOULDER_LENGTH = 7
    const ARM_ELBOW_LENGTH = 12
    const ARM_MAX_MEMORY_STATES = 20
    const ARM_JOYSTICK_LOW = 800
    const ARM_JOYSTICK_HIGH = 3200
    const ARM_SWITCH_PRESSED = 800
    const ARM_DEG_TO_RAD = 0.017453292519943295
    const ARM_RAD_TO_DEG = 57.29577951308232

    let armJointOutputs = [
        ArmOutputChannel.STC0,
        ArmOutputChannel.STC1,
        ArmOutputChannel.STC2,
        ArmOutputChannel.STC3
    ]
    let armJointAngles = [90, 90, 90, 90]
    let armLastSpeed = 50

    let armMemoryChassis: number[] = []
    let armMemoryShoulder: number[] = []
    let armMemoryElbow: number[] = []
    let armMemoryClaws: number[] = []

    let armLeftJoystick = [0, 1, 4]
    let armRightJoystick = [2, 3, 5]
    let armLeftJoystickConfigured = false
    let armRightJoystickConfigured = false
    let armJoystickLoopStarted = false
    let armLeftSwitchWasPressed = false
    let armLeftSwitchPressStart = 0
    let armLeftLongPressHandled = false
    let armRightSwitchWasPressed = false

    function constrainArmJointAngle(joint: ArmJoint, angle: number): number {
        angle = Math.round(angle)
        if (joint == ArmJoint.Claws) {
            return Math.constrain(angle, 90, 180)
        }
        return Math.constrain(angle, 0, 180)
    }

    function writeArmJoint(joint: ArmJoint, angle: number): void {
        angle = constrainArmJointAngle(joint, angle)
        armJointAngles[joint] = angle
        writeArmOutput(armJointOutputs[joint], angle)
    }

    function armStepDelay(speed: number): number {
        speed = Math.constrain(Math.round(speed), 1, 100)
        return Math.idiv(101 - speed, 2) + 1
    }

    function moveArmPose(
        chassis: number,
        shoulder: number,
        elbow: number,
        claws: number,
        speed: number
    ): void {
        chassis = constrainArmJointAngle(ArmJoint.Chassis, chassis)
        shoulder = constrainArmJointAngle(ArmJoint.Shoulder, shoulder)
        elbow = constrainArmJointAngle(ArmJoint.Elbow, elbow)
        claws = constrainArmJointAngle(ArmJoint.Claws, claws)
        speed = Math.constrain(Math.round(speed), 1, 100)
        armLastSpeed = speed

        let starts = [
            armJointAngles[ArmJoint.Chassis],
            armJointAngles[ArmJoint.Shoulder],
            armJointAngles[ArmJoint.Elbow],
            armJointAngles[ArmJoint.Claws]
        ]
        let targets = [chassis, shoulder, elbow, claws]
        let maxDelta = 0
        for (let joint = 0; joint < 4; joint++) {
            let delta = Math.abs(targets[joint] - starts[joint])
            if (delta > maxDelta) {
                maxDelta = delta
            }
        }

        if (maxDelta == 0) {
            for (let joint = 0; joint < 4; joint++) {
                writeArmJoint(joint, targets[joint])
            }
            return
        }

        let delayMs = armStepDelay(speed)
        for (let step = 1; step <= maxDelta; step++) {
            for (let joint = 0; joint < 4; joint++) {
                let angle = starts[joint] +
                    (targets[joint] - starts[joint]) * step / maxDelta
                writeArmJoint(joint, Math.round(angle))
            }
            basic.pause(delayMs)
        }
    }

    function saveArmPose(): void {
        if (armMemoryChassis.length >= ARM_MAX_MEMORY_STATES) {
            serial.writeLine("Arm memory full")
            return
        }
        armMemoryChassis.push(armJointAngles[ArmJoint.Chassis])
        armMemoryShoulder.push(armJointAngles[ArmJoint.Shoulder])
        armMemoryElbow.push(armJointAngles[ArmJoint.Elbow])
        armMemoryClaws.push(armJointAngles[ArmJoint.Claws])
        serial.writeLine("Arm pose saved")
    }

    function runArmPoses(): void {
        for (let index = 0; index < armMemoryChassis.length; index++) {
            moveArmPose(
                armMemoryChassis[index],
                armMemoryShoulder[index],
                armMemoryElbow[index],
                armMemoryClaws[index],
                armLastSpeed
            )
            basic.pause(100)
        }
        serial.writeLine("Arm poses complete")
    }

    function deleteArmPoses(): void {
        armMemoryChassis = []
        armMemoryShoulder = []
        armMemoryElbow = []
        armMemoryClaws = []
        serial.writeLine("Arm poses deleted")
    }

    function adjustArmJoint(joint: ArmJoint, delta: number): void {
        writeArmJoint(joint, armJointAngles[joint] + delta)
    }

    function updateArmJoystick(): void {
        if (armLeftJoystickConfigured) {
            let leftX = adc7828ReadChannel(armLeftJoystick[0])
            let leftY = adc7828ReadChannel(armLeftJoystick[1])
            let leftSwitch = adc7828ReadChannel(armLeftJoystick[2])

            if (leftY < ARM_JOYSTICK_LOW) {
                adjustArmJoint(ArmJoint.Chassis, 1)
            } else if (leftY > ARM_JOYSTICK_HIGH) {
                adjustArmJoint(ArmJoint.Chassis, -1)
            }
            if (leftX < ARM_JOYSTICK_LOW) {
                adjustArmJoint(ArmJoint.Shoulder, 1)
            } else if (leftX > ARM_JOYSTICK_HIGH) {
                adjustArmJoint(ArmJoint.Shoulder, -1)
            }

            let leftPressed = leftSwitch < ARM_SWITCH_PRESSED
            if (leftPressed && !armLeftSwitchWasPressed) {
                armLeftSwitchWasPressed = true
                armLeftSwitchPressStart = input.runningTime()
                armLeftLongPressHandled = false
            } else if (leftPressed && !armLeftLongPressHandled &&
                       input.runningTime() - armLeftSwitchPressStart >= 3000) {
                deleteArmPoses()
                armLeftLongPressHandled = true
            } else if (!leftPressed && armLeftSwitchWasPressed) {
                if (!armLeftLongPressHandled) {
                    saveArmPose()
                }
                armLeftSwitchWasPressed = false
                armLeftLongPressHandled = false
            }
        }

        if (armRightJoystickConfigured) {
            let rightX = adc7828ReadChannel(armRightJoystick[0])
            let rightY = adc7828ReadChannel(armRightJoystick[1])
            let rightSwitch = adc7828ReadChannel(armRightJoystick[2])

            if (rightX < ARM_JOYSTICK_LOW) {
                adjustArmJoint(ArmJoint.Elbow, 1)
            } else if (rightX > ARM_JOYSTICK_HIGH) {
                adjustArmJoint(ArmJoint.Elbow, -1)
            }
            if (rightY > ARM_JOYSTICK_HIGH) {
                adjustArmJoint(ArmJoint.Claws, 1)
            } else if (rightY < ARM_JOYSTICK_LOW) {
                adjustArmJoint(ArmJoint.Claws, -1)
            }

            let rightPressed = rightSwitch < ARM_SWITCH_PRESSED
            if (rightPressed && !armRightSwitchWasPressed) {
                armRightSwitchWasPressed = true
                runArmPoses()
            } else if (!rightPressed) {
                armRightSwitchWasPressed = false
            }
        }
    }

    function ensureArmJoystickLoop(): void {
        if (armJoystickLoopStarted) {
            return
        }
        armJoystickLoopStarted = true
        control.inBackground(function () {
            while (true) {
                updateArmJoystick()
                basic.pause(20)
            }
        })
    }

    /** Initialize the four robotic-arm joint outputs at 90 degrees. */
    //% blockId=armInitialize block="robotic arm initialize|chassis %chassis|shoulder %shoulder|elbow %elbow|claws %claws"
    //% chassis.defl=ArmOutputChannel.STC0
    //% shoulder.defl=ArmOutputChannel.STC1
    //% elbow.defl=ArmOutputChannel.STC2
    //% claws.defl=ArmOutputChannel.STC3
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=100
    //% help=github:acebott/docs/reference
    export function armInitialize(
        chassis: ArmOutputChannel,
        shoulder: ArmOutputChannel,
        elbow: ArmOutputChannel,
        claws: ArmOutputChannel
    ): void {
        armJointOutputs[ArmJoint.Chassis] = chassis
        armJointOutputs[ArmJoint.Shoulder] = shoulder
        armJointOutputs[ArmJoint.Elbow] = elbow
        armJointOutputs[ArmJoint.Claws] = claws
        armJointAngles = [90, 90, 90, 90]
        for (let joint = 0; joint < 4; joint++) {
            writeArmJoint(joint, 90)
        }
    }

    /** Set one robotic-arm joint angle and movement speed. */
    //% blockId=armSetJoint block="set robotic arm %joint|angle %angle|speed %speed"
    //% angle.min=0 angle.max=180 angle.defl=90
    //% speed.min=1 speed.max=100 speed.defl=50
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=95
    //% help=github:acebott/docs/reference
    export function armSetJoint(joint: ArmJoint, angle: number, speed: number): void {
        let targets = [
            armJointAngles[ArmJoint.Chassis],
            armJointAngles[ArmJoint.Shoulder],
            armJointAngles[ArmJoint.Elbow],
            armJointAngles[ArmJoint.Claws]
        ]
        targets[joint] = angle
        moveArmPose(targets[0], targets[1], targets[2], targets[3], speed)
    }

    /** Save, run, or delete recorded robotic-arm poses. */
    //% blockId=armMemory block="robotic arm memory %mode"
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=90
    //% help=github:acebott/docs/reference
    export function armMemory(mode: ArmMemoryMode): void {
        if (mode == ArmMemoryMode.Save) {
            saveArmPose()
        } else if (mode == ArmMemoryMode.Run) {
            runArmPoses()
        } else {
            deleteArmPoses()
        }
    }

    /** Move the robotic arm to an XYZ coordinate in centimeters. */
    //% blockId=armSetPosition block="robotic arm coordinate control|X %x|Y %y|Z %z"
    //% x.min=-19 x.max=19 x.defl=0
    //% y.min=0 y.max=19 y.defl=10
    //% z.min=0 z.max=27 z.defl=10
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=85
    //% help=github:acebott/docs/reference
    export function armSetPosition(x: number, y: number, z: number): void {
        if (x < -19 || x > 19 || y < 0 || y > 19 || z < 0 || z > 27) {
            serial.writeLine("Arm XYZ out of range")
            return
        }

        let horizontal = Math.sqrt(x * x + y * y)
        let vertical = z - ARM_BASE_HEIGHT
        let distance = Math.sqrt(horizontal * horizontal + vertical * vertical)
        if (distance < 8 || distance > 19 || (horizontal == 0 && z < 20)) {
            serial.writeLine("Arm XYZ unreachable")
            return
        }

        let chassis = 90 - Math.atan2(x, y) * ARM_RAD_TO_DEG
        let shoulderCos = (distance * distance +
            ARM_SHOULDER_LENGTH * ARM_SHOULDER_LENGTH -
            ARM_ELBOW_LENGTH * ARM_ELBOW_LENGTH) /
            (2 * ARM_SHOULDER_LENGTH * distance)
        let elbowCos = -(distance * distance -
            ARM_SHOULDER_LENGTH * ARM_SHOULDER_LENGTH -
            ARM_ELBOW_LENGTH * ARM_ELBOW_LENGTH) /
            (2 * ARM_SHOULDER_LENGTH * ARM_ELBOW_LENGTH)
        shoulderCos = Math.constrain(shoulderCos, -1, 1)
        elbowCos = Math.constrain(elbowCos, -1, 1)

        let verticalAngle = Math.acos(horizontal / distance)
        if (vertical < 0) {
            verticalAngle = -verticalAngle
        }
        let shoulder = 180 -
            (verticalAngle + Math.acos(shoulderCos)) * ARM_RAD_TO_DEG
        let elbow = Math.acos(elbowCos) * ARM_RAD_TO_DEG

        if (shoulder < 0 || shoulder > 180 || elbow < 0 || elbow > 180) {
            serial.writeLine("Arm XYZ solution out of range")
            return
        }
        moveArmPose(chassis, shoulder, elbow,
            armJointAngles[ArmJoint.Claws], armLastSpeed)
    }

    /** Get the current robotic-arm XYZ coordinate in centimeters. */
    //% blockId=armGetCoordinate block="get robotic arm coordinate %axis"
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=80
    //% help=github:acebott/docs/reference
    export function armGetCoordinate(axis: ArmCoordinateAxis): number {
        let shoulderRadians =
            (armJointAngles[ArmJoint.Shoulder] - 90) * ARM_DEG_TO_RAD
        let elbowRadians =
            (180 - armJointAngles[ArmJoint.Elbow]) * ARM_DEG_TO_RAD
        let radial = ARM_SHOULDER_LENGTH * Math.sin(shoulderRadians) +
            ARM_ELBOW_LENGTH * Math.sin(shoulderRadians + elbowRadians)
        let z = ARM_BASE_HEIGHT +
            ARM_SHOULDER_LENGTH * Math.cos(shoulderRadians) +
            ARM_ELBOW_LENGTH * Math.cos(shoulderRadians + elbowRadians)
        let chassisRadians =
            (90 - armJointAngles[ArmJoint.Chassis]) * ARM_DEG_TO_RAD
        let x = radial * Math.sin(chassisRadians)
        let y = radial * Math.cos(chassisRadians)

        if (axis == ArmCoordinateAxis.X) {
            return Math.round(x)
        } else if (axis == ArmCoordinateAxis.Y) {
            return Math.round(y)
        }
        return Math.round(z)
    }

    /** Get the current angle of one robotic-arm joint. */
    //% blockId=armGetJointAngle block="get robotic arm %joint angle"
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=75
    //% help=github:acebott/docs/reference
    export function armGetJointAngle(joint: ArmJoint): number {
        return armJointAngles[joint]
    }

    /** Configure one ADC7828 joystick and start background arm control. */
    //% blockId=armSetJoystick block="set %side joystick|X %xChannel|Y %yChannel|SW %swChannel"
    //% xChannel.defl=Adc7828Channel.CH0
    //% yChannel.defl=Adc7828Channel.CH1
    //% swChannel.defl=Adc7828Channel.CH4
    //% group="Microbit Robotic Arm"
    //% subcategory="Executive"
    //% weight=70
    //% help=github:acebott/docs/reference
    export function armSetJoystick(
        side: ArmJoystickSide,
        xChannel: Adc7828Channel,
        yChannel: Adc7828Channel,
        swChannel: Adc7828Channel
    ): void {
        if (side == ArmJoystickSide.Left) {
            armLeftJoystick = [xChannel, yChannel, swChannel]
            armLeftJoystickConfigured = true
        } else {
            armRightJoystick = [xChannel, yChannel, swChannel]
            armRightJoystickConfigured = true
        }
        ensureArmJoystickLoop()
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
    //% blockHidden=true
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
    //% blockHidden=true
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
    //% blockHidden=true
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
    //% blockHidden=true
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
    //% blockHidden=true
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

