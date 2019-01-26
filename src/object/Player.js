import { Entity } from 'object/Entity'
import { getBlocksInRadius } from 'utility'

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
        this.entity.body.setSize(4, 4)
        this.entity.body.setOffset(6, 12)
        this.entity.setDepth(1)
        this.normalSpeed = 100
        this.speed = this.normalSpeed

        // Setup animation
        this.cursors = scene.input.keyboard.createCursorKeys()
        this.lastDirection = 'down'

        // Picked up item
        this.pickedUp = null;
        this.lastSpaceDown = null;

        this.peacefulness = 0
        this.addPeacefulness(100)
    }

    addPeacefulness(delta) {
        this.peacefulness += delta
        this.peacefulness = Math.min(100, this.peacefulness)
        this.scene.events.emit('peacefulness', this.peacefulness)
    }

    _pickup(dynamicLayer, carpetLayer) {
        let pickupSides = DIRECTION_OFFSET[this.lastDirection]
                          .concat([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]])
        let layers = [dynamicLayer, carpetLayer]
        let validPickup = null

        for (let i = 0; i < pickupSides.length && validPickup == null; i++)
        {
            for (let layer of layers)
            {
                let [tx, ty] = this.getTileCoords(layer)
                tx += pickupSides[i][0]
                ty += pickupSides[i][1]
                let tile = layer.getTileAt(tx, ty)
                if (!tile) {
                    continue
                }
                validPickup = [layer, tx, ty]
                break
            }
        }

        if (validPickup)
        {
            // Pickup item
            const [layer, tileX, tileY] = validPickup
            let tile = layer.removeTileAt(tileX, tileY)
            this.pickedUp = { layer, index: tile.index }
            this.scene.events.emit("pickUp", {key: 'tiles', value: this.pickedUp.index})
            console.log("Picked up item", this.pickedUp.index)
        }
    }

    _putdown() {
        let dirOffset = DIRECTION_OFFSET[this.lastDirection][0]
        const {layer, index} = this.pickedUp
        let [tileX, tileY] = this.getTileCoords(layer)
        tileX += dirOffset[0]
        tileY += dirOffset[1]

        let tileAt = layer.getTileAt(tileX, tileY)

        if (tileAt == null)
        {
            layer.putTileAt(index, tileX, tileY)
            this.pickedUp = null;
            this.scene.events.emit("placeDown")
        }
    }

    _processMovement(delta) {
        let deltaSec = delta / 1000
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

        if (this.cursors.shift.isDown) {
          this.speed = 150
          this.addPeacefulness(deltaSec * -5)
        } else {
          this.speed = this.normalSpeed
        }
        velocity.normalize().scale(this.speed)
        this.entity.setVelocity(velocity.x, velocity.y)

        let animation_name = 'player-' +
                             (isStill ? 'still-' : '') +
                             this.lastDirection;
        this.entity.anims.play(animation_name, true)
        this.animation_name = animation_name
    }


    _processPeacefulnessBlocks(deltaSec, layer) {
        let pos = this.getPosition()
        let deltaChange = 0
        let addScale = 2 * deltaSec
        let MAX_BLOCK_RADIUS = 5
        for (let block of getBlocksInRadius(this, layer, MAX_BLOCK_RADIUS))
        {
            let dist = (new Phaser.Math.Vector2(block.getCenterX(), block.getCenterY()))
                                       .subtract(pos).length()
            let maxDist = MAX_BLOCK_RADIUS * 16
            if (dist > maxDist) {
                continue
            }
            let value = (maxDist - dist) / maxDist
            deltaChange += (value * addScale)
        }
        return deltaChange
    }

    _processPeacefulness(delta, enemies, dynamicLayer, carpetLayer) {
        let pos = this.getPosition()
        let deltaChange = 0
        let deltaSec = delta / 1000

        let removeScale = 3 * deltaSec
        let maxEnemyDist = 9 * 16
        for (let enemy of enemies)
        {
            if (enemy.good){
              continue
            }
            let dist = enemy.getPosition().subtract(pos).length()
            if (dist > maxEnemyDist) {
                continue
            }
            let value = (maxEnemyDist - dist) / maxEnemyDist
            deltaChange += -(value * removeScale)
        }

        deltaChange += this._processPeacefulnessBlocks(deltaSec, dynamicLayer)
        deltaChange += this._processPeacefulnessBlocks(deltaSec, carpetLayer)
        this.addPeacefulness(deltaChange)
    }

    update(delta, dynamicLayer, carpetLayer, enemies) {
        this._processMovement(delta)
        this._processPeacefulness(delta, enemies, dynamicLayer, carpetLayer)

        // Pickup, putdown item
        if (this.cursors.space.isDown &&
            this.cursors.space.timeDown != this.lastSpaceDown) { // simulate ondown
            this.lastSpaceDown = this.cursors.space.timeDown;
            if (this.pickedUp == null) {
                this._pickup(dynamicLayer, carpetLayer)
            } else {
                this._putdown()
            }
        }
    }
}
