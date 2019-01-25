import Player from 'object/Player'

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

export class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'gameScene'} );
    }

    preload() {
        this.load.image('tiles', 'assets/basictiles.png');
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

        let tiles = map.addTilesetImage('tiles')
        let layer = map.createStaticLayer(0, tiles, 0, 0)

        this.cameras.main.setZoom(2)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        Player.DefinePlayerAnimations(this)

        this.e = {
            player: Player.Initialize(this),
            cursors: this.input.keyboard.createCursorKeys(),
        }
    }

    update() {
        Player.UpdatePlayer(this.e.player, this.e.cursors)
    }
}
