import { Player } from 'object/Player'
import { Enemy } from 'object/Enemy'

function create2DArray(n, m, defaultVal = 0) {
    let level = []
    for (let i = 0; i < n; i++)
    {
        let row = []
        for (let j = 0; j < m; j++)
            row.push(defaultVal)
        level.push(row)
    }
    return level
}


function generateMajaBlocks(dynamicLayer) {
    let objects = [
        1, 3, 5, 7, 52, 53, 55, 56, 91, 99, 107, 115, 97, 98,
    ]
    dynamicLayer.setCollisionBetween(1, 15 * 8)
    dynamicLayer.setCollision([4, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                               75, 76, 67, 52, 53, 60], false)

    for (let i = 0; i < 1500; i++)
    {
        let x, y
        do {
            x = Phaser.Math.RND.between(0, dynamicLayer.tilemap.width - 1)
            y = Phaser.Math.RND.between(0, dynamicLayer.tilemap.height - 1)
        } while (dynamicLayer.getTileAt(x, y) != null);

        dynamicLayer.putTileAt(Phaser.Math.RND.weightedPick(objects), x, y)
    }
}

function generatePaklajiBlocks(layer) {
    let objects = [
        83, 84, 85, 86, 9, 10, 17, 18
    ]

    for (let i = 0; i < 800; i++)
    {
        let x, y
        do {
            x = Phaser.Math.RND.between(0, layer.tilemap.width - 1)
            y = Phaser.Math.RND.between(0, layer.tilemap.height - 1)
        } while (layer.getTileAt(x, y) != null);

        layer.putTileAt(Phaser.Math.RND.weightedPick(objects), x, y)
    }
}

export class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'gameScene'} );
    }

    preload() {
    }

    create() {
        // Setup animations
        Enemy.InitializeAnimations(this)
        Player.InitializeAnimations(this)

        let level = create2DArray(300, 300, 10)

        let map = this.make.tilemap({ key: 'tilemap' })
        let tileset = map.addTilesetImage('test', 'tiles')
        let layer = map.createStaticLayer('Karte', tileset)
        let videjaisLayer = map.createStaticLayer('Videjais', tileset)
        let carpetLayer = map.createDynamicLayer('Paklaji', tileset)
        let dynamicLayer = map.createDynamicLayer('Maja', tileset)
        generateMajaBlocks(dynamicLayer)
        generatePaklajiBlocks(carpetLayer)

        this.cameras.main.setZoom(2)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.e = {
            player: new Player(this, 261 * 16, 181 * 16),
            map,
            dynamicLayer,
            carpetLayer,
            // Holds enemies
            enemies: [],
            enemiesGroup: this.physics.add.group()
        }

        this.cameras.main.startFollow(this.e.player.getObject(), true, 0.1, 0.1)
        this.physics.add.collider(this.e.player.getObject(), dynamicLayer)
        this.physics.add.collider(this.e.enemiesGroup, dynamicLayer)
        this.physics.add.collider(this.e.enemiesGroup, this.e.enemiesGroup)
        this.physics.add.collider(this.e.enemiesGroup, this.e.player.getObject())

        this.timedEvent = this.time.delayedCall(1000, this.setupEnemies, [], this)
    }

    setupEnemies() {
        let playerPos = this.e.player.getPosition()
        for (let i = 0; i < 100; i++)
        {
            let x, y, distance
            do {
                x = Phaser.Math.RND.between(0, this.e.map.widthInPixels - 1)
                y = Phaser.Math.RND.between(0, this.e.map.heightInPixels - 1)
                distance = (new Phaser.Math.Vector2(x, y)).subtract(playerPos).length()
            } while (distance < 100 * 16);
            let enemy = new Enemy(this, x, y)
            this.e.enemies.push(enemy)
            this.e.enemiesGroup.add(enemy.getObject())
        }
        console.log("Enemies spawned")
    }

    update(time, delta) {
        this.e.player.update(delta, this.e.dynamicLayer, this.e.carpetLayer, this.e.enemies)
        for (let enemy of this.e.enemies)
        {
            enemy.update(delta, this.e.player, this.e.dynamicLayer, this.e.carpetLayer)
        }
    }
}
