import { Player } from 'object/Player'

function create2DArray(n, m, defaultVal = 0) {
    let level = []
    for (let i = 0; i < 100; i++)
    {
        let row = []
        for (let j = 0; j < 100; j++)
            row.push(defaultVal)
        level.push(row)
    }
    return level
}


function generateBlocks(scene, dynamicLayer)
{
    let objects = [
        0, 2, 4, 6, 51, 52, 54, 55
    ]
    dynamicLayer.setCollisionBetween(0, 15 * 8)
    dynamicLayer.setCollision([51, 52], false)

    for (let i = 0; i < 500; i++)
    {
        let x, y
        do {
            x = Phaser.Math.RND.between(0, dynamicLayer.tilemap.width - 1)
            y = Phaser.Math.RND.between(0, dynamicLayer.tilemap.height - 1)
        } while (dynamicLayer.getTileAt(x, y) != null);

        let idx = Phaser.Math.RND.between(0, objects.length - 1)
        dynamicLayer.putTileAt(objects[idx], x, y)
    }
}

export class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'gameScene'} );
    }

    preload() {
        this.load.spritesheet('tiles', 'assets/basictiles.png',
                              {frameWidth:  16, frameHeight: 16});
        this.load.spritesheet('characters', 'assets/characters.png',
                              {frameWidth:  16, frameHeight: 16});
    }

    create() {
        let level = create2DArray(100, 100, 10)

        let map = this.make.tilemap({
            data: level,
            tileWidth: 16,
            tileHeight: 16,
        })

        let tileset = map.addTilesetImage('tiles')
        let layer = map.createStaticLayer(0, tileset, 0, 0)
        let dynamicLayer = map.createBlankDynamicLayer('Dynamic', tileset)
        generateBlocks(this, dynamicLayer)

        this.cameras.main.setZoom(2)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.e = {
            player: new Player(this, map.widthInPixels / 2, map.heightInPixels / 2),
        }

        this.cameras.main.startFollow(this.e.player.getObject(), true, 0.1, 0.1)
        this.physics.add.collider(this.e.player.getObject(), dynamicLayer)
    }

    update() {
        this.e.player.update()
    }
}
