let remoteX = 512
let remoteY = 512
let remoteKey = 0
let lastReceive = 0
let lastLimitPrint = 0
let lastPosePrint = 0
let chassis = 0
let shoulder = 0
let elbow = 0
let claws = 0
let nextChassis = 0
let nextShoulder = 0
let nextElbow = 0
let nextClaws = 0

function readJointAngles () {
    chassis = Acebott.armGetJointAngle(Acebott.ArmJoint.Chassis)
    shoulder = Acebott.armGetJointAngle(Acebott.ArmJoint.Shoulder)
    elbow = Acebott.armGetJointAngle(Acebott.ArmJoint.Elbow)
    claws = Acebott.armGetJointAngle(Acebott.ArmJoint.Claws)
}

function printLimit (joint: string, target: number) {
    if (control.millis() - lastLimitPrint >= 500) {
        serial.writeLine("LIMIT " + joint + " target=" + target + " C=" + chassis + " S=" + shoulder + " E=" + elbow + " G=" + claws)
        lastLimitPrint = control.millis()
    }
}

function printPose () {
    serial.writeLine("Chassis angle=" + chassis + " Shoulder angle=" + shoulder + " Elbow angle=" + elbow + " Claws angle=" + claws)
}

radio.onReceivedValue(function (name, value) {
    if (name == "X" && value >= 0 && value <= 1023) {
        remoteX = value
        lastReceive = control.millis()
    } else if (name == "Y" && value >= 0 && value <= 1023) {
        remoteY = value
        lastReceive = control.millis()
    } else if (name == "K" && value >= 0 && value <= 4 && value == Math.round(value)) {
        remoteKey = value
        lastReceive = control.millis()
    }
})

radio.setGroup(23)
Acebott.armInitialize(Acebott.ArmOutputChannel.STC0, Acebott.ArmOutputChannel.STC1, Acebott.ArmOutputChannel.STC2, Acebott.ArmOutputChannel.STC3)
readJointAngles()
printPose()

basic.forever(function () {
    if (control.millis() - lastReceive <= 500) {
        readJointAngles()
        nextChassis = chassis
        nextShoulder = shoulder
        nextElbow = elbow
        nextClaws = claws
        // Y: 底盘
        if (remoteY < 350) {
            nextChassis = Math.constrain(chassis + 3, 0, 180)
        } else if (remoteY > 650) {
            nextChassis = Math.constrain(chassis - 3, 0, 180)
        }
        // X: 肩部
        if (remoteX < 350) {
            nextShoulder = Math.constrain(shoulder + 3, 0, 180)
        } else if (remoteX > 650) {
            nextShoulder = Math.constrain(shoulder - 3, 0, 180)
        }
        // 上: 肘部抬起; 下: 肘部下降
        if (remoteKey == 1) {
            nextElbow = Math.constrain(elbow + 3, 0, 120)
        } else if (remoteKey == 2) {
            nextElbow = Math.constrain(elbow - 3, 0, 120)
        }
        // 左: 张开夹爪; 右: 闭合夹爪
        if (remoteKey == 3) {
            nextClaws = Math.constrain(claws + 3, 90, 180)
        } else if (remoteKey == 4) {
            nextClaws = Math.constrain(claws - 3, 90, 180)
        }
        if (nextChassis != chassis) {
            Acebott.armSetJoint(Acebott.ArmJoint.Chassis, nextChassis, 100)
        }
        if (nextShoulder != shoulder) {
            Acebott.armSetJoint(Acebott.ArmJoint.Shoulder, nextShoulder, 100)
        }
        if (nextElbow != elbow) {
            Acebott.armSetJoint(Acebott.ArmJoint.Elbow, nextElbow, 100)
        }
        if (nextClaws != claws) {
            Acebott.armSetJoint(Acebott.ArmJoint.Claws, nextClaws, 100)
        }
        // 以库接受的角度为准, 限位检查由库完成。
        readJointAngles()
        if (chassis != nextChassis) {
            printLimit("Chassis", nextChassis)
        }
        if (shoulder != nextShoulder) {
            printLimit("Shoulder", nextShoulder)
        }
        if (elbow != nextElbow) {
            printLimit("Elbow", nextElbow)
        }
        if (claws != nextClaws) {
            printLimit("Claws", nextClaws)
        }
        if (control.millis() - lastPosePrint >= 500) {
            printPose()
            lastPosePrint = control.millis()
        }
    } else {
        // 无线信号中断后保持当前位置, 清除旧指令。
        remoteX = 512
        remoteY = 512
        remoteKey = 0
    }
    basic.pause(10)
})
