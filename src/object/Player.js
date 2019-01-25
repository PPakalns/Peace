function updatePlayer(player, cursors) {

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
    updatePlayer,
}
