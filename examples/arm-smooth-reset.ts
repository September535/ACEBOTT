// A: move to the test pose; wait for completion before pressing B.
Acebott.armInitialize(
    Acebott.ArmOutputChannel.STC0,
    Acebott.ArmOutputChannel.STC1,
    Acebott.ArmOutputChannel.STC2,
    Acebott.ArmOutputChannel.STC3
)

input.onButtonPressed(Button.A, function () {
    Acebott.armSetJoint(Acebott.ArmJoint.Chassis, 120, 50)
    Acebott.armSetJoint(Acebott.ArmJoint.Shoulder, 60, 50)
    Acebott.armSetJoint(Acebott.ArmJoint.Elbow, 60, 50)
    Acebott.armSetJoint(Acebott.ArmJoint.Claws, 140, 50)
})

// B: set the reset speed using the existing speed block, then reset.
input.onButtonPressed(Button.B, function () {
    Acebott.armSetSpeed(Acebott.ArmSpeed.Slow)
    Acebott.armReset()
})
