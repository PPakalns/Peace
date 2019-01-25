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

        this.anims.create({
            key: 'player-still',
            frames: [ {  key: 'characters', frame: 7 } ],
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'player-down',
            frames: this.anims.generateFrameNumbers('characters', {start: 6, end: 8}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'player-left',
            frames: this.anims.generateFrameNumbers('characters', {start: 18, end: 20}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'player-right',
            frames: this.anims.generateFrameNumbers('characters', {start: 30, end: 32}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'player-up',
            frames: this.anims.generateFrameNumbers('characters', {start: 42, end: 44}),
            frameRate: 10,
            repeat: -1,
        })

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

        let player = this.physics.add.sprite(0, 0, 'characters')
        player.setCollideWorldBounds(true)
        this.cameras.main.startFollow(player, true, 0.1, 0.1)

        this.e = {
            player,
            cursors: this.input.keyboard.createCursorKeys(),
        }
    }

    update() {
        Player.updatePlayer(this.e.player, this.e.cursors)
    }
}
