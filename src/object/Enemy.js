import { Entity } from 'object/Entity'

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
    }

    constructor(scene, x, y) {
        super(scene)

        this.entity = scene.physics.add.sprite(x, y, 'characters', 1)
        this.entity.setCollideWorldBounds(true)
        this.speed = 30

        this.lastDir = 'down'
    }

    update(playerEntity) {
        let playerPos = playerEntity.getPosition()
        let pos = this.getPosition()
        let diff = playerPos.clone().subtract(pos).normalize().scale(this.speed)
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

        this.entity.anims.play('ghost-' + this.lastDir, true)
    }
}
