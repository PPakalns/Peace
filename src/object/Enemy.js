import { Entity } from 'object/Entity'

export class Enemy extends Entity{
    constructor(scene, x, y) {
        super(scene)
        this.entity = scene.physics.add.sprite(x, y, 'characters', 1)
        this.entity.setCollideWorldBounds(true)
        this.speed = 90
    }

    update(playerEntity) {
        let playerPos = playerEntity.getPosition()
        let pos = this.getPosition()
        let diff = playerPos.clone().subtract(pos).normalize().scale(this.speed)
        this.entity.setVelocity(diff.x, diff.y)
    }
}
