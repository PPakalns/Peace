
function create2DArray(n, m) {
    let level = []
    for (let i = 0; i < 100; i++)
    {
        let row = []
        for (let j = 0; j < 100; j++)
            row.push(0)
        level.push(row)
    }
    return level
}

export class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('tiles', 'assets/basictiles.png');
    }

    create() {
        let level = create2DArray(100, 100)

        let map = this.make.tilemap({
            data: level,
            tileWidth: 16,
            tileHeight: 16,
        })

        let tiles = map.addTilesetImage('tiles')
        let layer = map.createStaticLayer(0, tiles, 0, 0)

        this.cameras.main.setZoom(2)
        this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    }
}
