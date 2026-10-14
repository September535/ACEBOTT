// 蓝牙通信用现成拓展积木；机械臂动作使用封装积木。
// 学生可以沿着“收到文字 → 判断指令 → 执行动作 → 返回结果”阅读。

function sendMessage (message: string) {
    serial.writeLine(message)
    bluetooth.uartWriteString(message + "#")
}

function handleAppCommand (command: string) {
    let commandType = command.substr(0, 2)
    serial.writeLine("RX=" + command)
    if (commandType == "11" || commandType == "12") {
        // 左、右摇杆：最后一位表示方向，0 表示停止。
        if (command.length == 4 && command.substr(2, 1) == "0") {
            if (commandType == "11") {
                Acebott.armAppSetJoystick(Acebott.ArmAppSide.Left, parseInt(command.substr(3, 1)))
            } else {
                Acebott.armAppSetJoystick(Acebott.ArmAppSide.Right, parseInt(command.substr(3, 1)))
            }
        } else {
            sendMessage("UNKNOWN COMMAND")
        }
    } else if (commandType == "13") {
        // 文本转成数字后，直接使用已有的关节角度积木。
        let angle = Acebott.armAppParseAngle(command.substr(4))
        if (angle >= 0) {
            if (command.substr(0, 4) == "1301") {
                Acebott.armSetJoint(Acebott.ArmJoint.Claws, angle, 100)
            } else if (command.substr(0, 4) == "1302") {
                Acebott.armSetJoint(Acebott.ArmJoint.Elbow, angle, 100)
            } else if (command.substr(0, 4) == "1303") {
                Acebott.armSetJoint(Acebott.ArmJoint.Shoulder, angle, 100)
            } else if (command.substr(0, 4) == "1304") {
                Acebott.armSetJoint(Acebott.ArmJoint.Chassis, angle, 100)
            } else {
                sendMessage("UNKNOWN COMMAND")
            }
        }
    } else if (command.substr(0, 4) == "1401") {
        // XYZ：把命令前缀去掉，交给机械臂处理坐标。
        let coordinates = Acebott.armAppParseCoordinates(command.substr(4))
        if (coordinates.length == 3) {
            Acebott.armSetPosition(coordinates[0], coordinates[1], coordinates[2])
        }
    } else if (command == "1501") {
        Acebott.armHomePose()
    } else if (commandType == "16") {
        // 姿态记忆：学生能直接看见按钮与动作的对应关系。
        if (command == "1601") {
            Acebott.armMemory(Acebott.ArmMemoryMode.StartRecording)
        } else if (command == "1602") {
            Acebott.armMemory(Acebott.ArmMemoryMode.Save)
        } else if (command == "1603") {
            Acebott.armMemory(Acebott.ArmMemoryMode.EndRecording)
        } else if (command == "1604") {
            Acebott.armMemory(Acebott.ArmMemoryMode.Run)
        } else if (command == "1605") {
            Acebott.armMemory(Acebott.ArmMemoryMode.Delete)
        } else if (command == "1606") {
            Acebott.armMemory(Acebott.ArmMemoryMode.RunLoop)
        } else if (command == "1607") {
            Acebott.armMemory(Acebott.ArmMemoryMode.Stop)
        } else {
            sendMessage("UNKNOWN COMMAND")
        }
    } else if (commandType == "17") {
        // 选择记忆组，并按 APP 要求返回原命令加 1 或 0。
        if (command == "1701" || command == "1702" || command == "1703") {
            Acebott.armAppSelectGroup(parseInt(command.substr(3, 1)))
            sendMessage(command + "1")
        } else {
            sendMessage(command + "0")
        }
    } else {
        sendMessage("UNKNOWN COMMAND")
    }
}

// 动作结果由主程序发送，机械臂封装本身不操作蓝牙。
Acebott.onArmAppResult(function (message) {
    sendMessage(message)
})

bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
    basic.pause(500)
    basic.clearScreen()
    sendMessage("CONNECTED")
})

bluetooth.onBluetoothDisconnected(function () {
    Acebott.armAppStop()
    basic.showIcon(IconNames.No)
})

// 每收到一个 #，就取出一条完整指令。
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
    handleAppCommand(bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash)))
})

// 初始化关节输出与蓝牙服务。
Acebott.armInitialize(Acebott.ArmOutputChannel.STC0, Acebott.ArmOutputChannel.STC1, Acebott.ArmOutputChannel.STC2, Acebott.ArmOutputChannel.STC3)
Acebott.armSetSpeed(Acebott.ArmSpeed.Medium)
Acebott.armAppPrepare()
bluetooth.startUartService()
basic.showIcon(IconNames.Heart)

// 循环持续推进动作；每次等待 20 毫秒。
basic.forever(function () {
    Acebott.armAppUpdate()
    basic.pause(20)
})
