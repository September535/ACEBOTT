// Transport program: keep variables, the loop and the action sequence visible.
function Init () {
    transportCount = 2
    pickX = 7
    pickY = 13
    pickZ = 2
    placeX = -7
    placeY = 13
    placeZ = 0
    liftHeight = 15
    Acebott.armInitialize(Acebott.ArmOutputChannel.STC0, Acebott.ArmOutputChannel.STC1, Acebott.ArmOutputChannel.STC2, Acebott.ArmOutputChannel.STC3)
    Acebott.armSetSpeed(Acebott.ArmSpeed.Fast)
    basic.pause(500)
}
let placeZ = 0
let placeY = 0
let placeX = 0
let liftHeight = 0
let pickZ = 0
let pickY = 0
let pickX = 0
let transportCount = 0
Init()
for (let cycle = 0; cycle <= transportCount - 1; cycle++) {
    basic.showNumber(cycle + 1)
    Acebott.armClaw(Acebott.ArmClawState.Open)
    basic.pause(500)
    Acebott.armSetPosition(pickX, pickY, pickZ - cycle * 2)
    basic.pause(500)
    Acebott.armClaw(Acebott.ArmClawState.Close)
    basic.pause(500)
    Acebott.armSetPosition(pickX, pickY, liftHeight)
    basic.pause(500)
    // Use the same upper waypoint for both transport cycles.
    Acebott.armSetPosition(placeX, placeY, liftHeight)
    basic.pause(500)
    Acebott.armSetPosition(placeX - cycle, placeY + cycle * 0.5, placeZ + cycle * 4.5)
    basic.pause(500)
    Acebott.armClaw(Acebott.ArmClawState.Open)
    basic.pause(500)
    Acebott.armSetPosition(placeX, placeY, liftHeight)
    basic.pause(500)
    Acebott.armHomePose()
    basic.pause(500)
}
