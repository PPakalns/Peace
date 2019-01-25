
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

        let player = this.physics.add.sprite(5, 5, 'characters')
        player.setCollideWorldBounds(true)
        this.cameras.main.startFollow(player, true, 0.1, 0.1)

        this.e = {
            player,
            cursors: this.input.keyboard.createCursorKeys(),
        }
    }

    update() {
        let player = this.e.player;

        player.setVelocity(0)
        if (this.e.cursors.left.isDown) {
            player.setVelocityX(-200)
        } else if (this.e.cursors.right.isDown) {
            player.setVelocityX(200)
        }

        if (this.e.cursors.up.isDown) {
            player.setVelocityY(-200);
        } else if (this.e.cursors.down.isDown) {
            player.setVelocityY(200);
        }
    }
}
