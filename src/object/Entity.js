export class Entity {

    constructor(scene) {
        this.scene = scene
    }

    getTileCoords(layer) {
        let tx = layer.worldToTileX(this.entity.x)
        let ty = layer.worldToTileY(this.entity.y)
        return [tx, ty]
    }

    getPosition() {
        return new Phaser.Math.Vector2(this.entity.x, this.entity.y)
    }

    getObject() {
        return this.entity
    }
}

