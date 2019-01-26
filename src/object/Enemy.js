import { Entity } from 'object/Entity'
import { getBlocksInRadius } from 'utility'

export class Enemy extends Entity{

    static InitializeAnimations(scene)
    {
        scene.anims.create({
            key: 'ghost-down',
            frames: scene.anims.generateFrameNumbers('characters', {start: 9, end: 11}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'ghost-left',
            frames: scene.anims.generateFrameNumbers('characters', {start: 21, end: 23}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'ghost-right',
            frames: scene.anims.generateFrameNumbers('characters', {start: 33, end: 35}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'ghost-up',
            frames: scene.anims.generateFrameNumbers('characters', {start: 45, end: 47}),
            frameRate: 10,
            repeat: -1,
        })

        scene.anims.create({
            key: 'girl-down',
            frames: scene.anims.generateFrameNumbers('characters', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'girl-left',
            frames: scene.anims.generateFrameNumbers('characters', {start: 12, end: 14}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'girl-right',
            frames: scene.anims.generateFrameNumbers('characters', {start: 24, end: 26}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'girl-up',
            frames: scene.anims.generateFrameNumbers('characters', {start: 36, end: 38}),
            frameRate: 10,
            repeat: -1,
        })
    }

    constructor(scene, x, y) {
        super(scene)

        this.entity = scene.physics.add.sprite(x, y, 'characters', 1)
        this.entity.setCollideWorldBounds(true)
        this.speed = 30

        this.lastDir = 'down'

        this.peacefulness = 0;
    }

    updateGood() {
        if (this.peacefulness > 60) {
            this.good = true;
        }
        if (this.peacefulness < 40) {
            this.good = false;
        }
    }

    addPeacefulness(delta) {
        this.peacefulness += delta
        this.peacefulness = Math.max(0, Math.min(this.peacefulness, 100))
    }

    _updatePeacefulness(delta, dynamicLayer) {
        let pos = this.getPosition()
        let deltaSec = delta / 1000
        let deltaChange = -1 * deltaSec

        let addScale = 1 * deltaSec
        let MAX_BLOCK_RADIUS = 5
        for (let block of getBlocksInRadius(this, dynamicLayer, MAX_BLOCK_RADIUS))
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
        this.addPeacefulness(deltaChange)
    }

    update(delta, playerEntity, dynamicLayer) {
        let playerPos = playerEntity.getPosition()

        this._updatePeacefulness(delta, dynamicLayer)
        this.updateGood()

        let pos = this.getPosition()
        let diff = playerPos.clone().subtract(pos).normalize().scale(this.speed)
        if (this.good) {
            diff.scale(-1)
        }
        this.entity.setVelocity(diff.x, diff.y)

        // Calculate which direction animation to show from velocity vector
        let lengthValues = [diff.x, -diff.x, diff.y, -diff.y]
        let name = ['right', 'left', 'down', 'up']
        let size = 0
        for (let i = 0; i < lengthValues.length; i++) {
            if (lengthValues[i] > size)
            {
                size = lengthValues[i]
                this.lastDir = name[i]
            }
        }

        this.entity.anims.play((this.good ? 'girl' : 'ghost') + '-' + this.lastDir, true)
    }
}
