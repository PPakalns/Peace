function DefinePlayerAnimations(scene) {
    scene.anims.create({
        key: 'player-still',
        frames: [ {  key: 'characters', frame: 7 } ],
        frameRate: 10,
        repeat: -1,
    })
    scene.anims.create({
        key: 'player-down',
        frames: scene.anims.generateFrameNumbers('characters', {start: 6, end: 8}),
        frameRate: 10,
        repeat: -1,
    })
    scene.anims.create({
        key: 'player-left',
        frames: scene.anims.generateFrameNumbers('characters', {start: 18, end: 20}),
        frameRate: 10,
        repeat: -1,
    })
    scene.anims.create({
        key: 'player-right',
        frames: scene.anims.generateFrameNumbers('characters', {start: 30, end: 32}),
        frameRate: 10,
        repeat: -1,
    })
    scene.anims.create({
        key: 'player-up',
        frames: scene.anims.generateFrameNumbers('characters', {start: 42, end: 44}),
        frameRate: 10,
        repeat: -1,
    })
}

function Initialize(scene) {
    let player = scene.physics.add.sprite(0, 0, 'characters')
    player.setCollideWorldBounds(true)
    scene.cameras.main.startFollow(player, true, 0.1, 0.1)
    return player;
}

function UpdatePlayer(player, cursors) {

    let animation_name = 'player-still'

    player.setVelocity(0)
    if (cursors.left.isDown) {
        player.setVelocityX(-200)
        animation_name = 'player-left'
    } else if (cursors.right.isDown) {
        player.setVelocityX(200)
        animation_name = 'player-right'
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200);
        animation_name = 'player-up'
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
        animation_name = 'player-down'
    }

    player.anims.play(animation_name, true)
}

export default {
    DefinePlayerAnimations,
    Initialize,
    UpdatePlayer,
}
