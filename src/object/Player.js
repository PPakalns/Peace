import { Entity } from 'object/Entity'

let DIRECTION_OFFSET = {
    "left": [[-1, 0], [-1, 1], [-1, -1]],
    "right": [[1, 0], [1, 1], [1, -1]],
    "down": [[0, 1], [-1, 1], [1, 1]],
    "up": [[0, -1], [1, -1], [-1, -1]],
}

export class Player extends Entity{

    static InitializeAnimations(scene) {
        scene.anims.create({
            key: 'player-still-down',
            frames: [ {  key: 'characters', frame: 7 } ],
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'player-still-left',
            frames: [ {  key: 'characters', frame: 19 } ],
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'player-still-right',
            frames: [ {  key: 'characters', frame: 31 } ],
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'player-still-up',
            frames: [ {  key: 'characters', frame: 43 } ],
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

    constructor(scene, x, y) {
        super(scene)

        this.entity = scene.physics.add.sprite(x, y, 'characters')
        this.entity.setCollideWorldBounds(true)
        this.speed = 100

        // Setup animation
        this.cursors = scene.input.keyboard.createCursorKeys()
        this.lastDirection = 'down'

        // Picked up item
        this.pickedUp = null;
        this.lastSpaceDown = null;
    }

    _pickup(dynamicLayer) {
        let pickupSides = DIRECTION_OFFSET[this.lastDirection]
                          .concat([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]])
        let validPickup = null
        for (let i = 0; i < pickupSides.length; i++)
        {
            let [tx, ty] = this.getTileCoords(dynamicLayer)
            tx += pickupSides[i][0]
            ty += pickupSides[i][1]
            let tile = dynamicLayer.getTileAt(tx, ty)
            if (!tile) {
                continue
            }
            validPickup = [tx, ty]
            break
        }

        if (validPickup)
        {
            // Pickup item
            const [tileX, tileY] = validPickup
            let tile = dynamicLayer.removeTileAt(tileX, tileY)
            this.pickedUp = tile.index
            this.scene.events.emit("pickUp", {key: 'tiles', value: this.pickedUp})
            console.log("Picked up item", this.pickedUp)
        }
    }

    _putdown(dynamicLayer) {
        let dirOffset = DIRECTION_OFFSET[this.lastDirection][0]
        let [tileX, tileY] = this.getTileCoords(dynamicLayer)
        tileX += dirOffset[0]
        tileY += dirOffset[1]

        let tileAt = dynamicLayer.getTileAt(tileX, tileY)

        if (tileAt == null)
        {
            dynamicLayer.putTileAt(this.pickedUp, tileX, tileY)
            this.pickedUp = null;
            this.scene.events.emit("placeDown")
        }
    }

    update(dynamicLayer) {
        let isStill = true

        let velocity = new Phaser.Math.Vector2(0, 0)

        this.entity.setVelocity(0)
        if (this.cursors.left.isDown) {
            velocity.x = -1;
            isStill = false
            this.lastDirection = 'left'
        } else if (this.cursors.right.isDown) {
            velocity.x = 1;
            isStill = false
            this.lastDirection = 'right'
        }

        if (this.cursors.up.isDown) {
            velocity.y = -1
            isStill = false
            this.lastDirection = 'up'
        } else if (this.cursors.down.isDown) {
            velocity.y = 1
            isStill = false
            this.lastDirection = 'down'
        }

        velocity.normalize().scale(this.speed)
        this.entity.setVelocity(velocity.x, velocity.y)

        let animation_name = 'player-' +
                             (isStill ? 'still-' : '') +
                             this.lastDirection;
        this.entity.anims.play(animation_name, true)

        if (this.cursors.space.isDown &&
            this.cursors.space.timeDown != this.lastSpaceDown) { // simulate ondown
            this.lastSpaceDown = this.cursors.space.timeDown;
            if (this.pickedUp == null) {
                this._pickup(dynamicLayer)
            } else {
                this._putdown(dynamicLayer)
            }
        }

        this.entity.anims.play(animation_name, true)
        this.animation_name = animation_name
    }
}
