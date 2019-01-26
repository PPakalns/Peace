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


function generateBlocks(scene, dynamicLayer)
{
    let objects = [
        0, 2, 4, 6, 51, 52, 54, 55
    ]
    dynamicLayer.setCollisionBetween(0, 15 * 8)
    dynamicLayer.setCollision([51, 52], false)

    for (let i = 0; i < 2000; i++)
    {
        let x, y
        do {
            x = Phaser.Math.RND.between(0, dynamicLayer.tilemap.width - 1)
            y = Phaser.Math.RND.between(0, dynamicLayer.tilemap.height - 1)
        } while (dynamicLayer.getTileAt(x, y) != null);

        dynamicLayer.putTileAt(Phaser.Math.RND.weightedPick(objects), x, y)
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
        this.load.tilemapCSV('karte', 'assets/Karte.csv');
        this.load.tilemapCSV('maja', 'assets/Maja.csv');
        this.load.tilemapCSV('videjais', 'assets/Videjais.csv');
    }

    create() {
        // Setup animations
        Enemy.InitializeAnimations(this)
        Player.InitializeAnimations(this)

        let level = create2DArray(300, 300, 10)

        let map = this.make.tilemap({
            key: 'karte',
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
            map,
            dynamicLayer,

            // Holds enemies
            enemies: [],
            enemiesGroup: this.physics.add.group()
        }

        this.cameras.main.startFollow(this.e.player.getObject(), true, 0.1, 0.1)
        this.physics.add.collider(this.e.player.getObject(), dynamicLayer)
        this.physics.add.collider(this.e.enemiesGroup, dynamicLayer)
        this.physics.add.collider(this.e.enemiesGroup, this.e.enemiesGroup)
        this.physics.add.collider(this.e.enemiesGroup, this.e.player.getObject())

        this.timedEvent = this.time.delayedCall(15000, this.setupEnemies, [], this)
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
            } while (distance < 30 * 16);
            let enemy = new Enemy(this, x, y)
            this.e.enemies.push(enemy)
            this.e.enemiesGroup.add(enemy.getObject())
        }
        console.log("Enemies spawned")
    }

    update() {
        this.e.player.update(this.e.dynamicLayer)
        for (let enemy of this.e.enemies)
        {
            enemy.update(this.e.player)
        }
    }
}
