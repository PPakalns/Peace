export class Player {
    constructor(scene) {
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

        this.scene = scene;
        this.player = scene.physics.add.sprite(0, 0, 'characters')
        this.player.setCollideWorldBounds(true)

        // Setup animation
        this.animation_name = 'player-still'
        this.player.anims.play(this.animation_name)
        this.cursors = scene.input.keyboard.createCursorKeys()
    }

    getObject() {
        return this.player
    }

    update() {
        let animation_name = 'player-still'

        this.player.setVelocity(0)
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200)
            animation_name = 'player-left'
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200)
            animation_name = 'player-right'
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
            animation_name = 'player-up'
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
            animation_name = 'player-down'
        }

        this.player.anims.play(animation_name, true)
        this.animation_name = animation_name
    }
}
