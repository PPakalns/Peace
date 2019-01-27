
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'menuScene'} );
        this.gameStarted=false;
    }

    preload() {
        this.load.image('Start_button', 'assets/Start_button.png')
        this.load.image('background','assets/background.png')
        this.load.spritesheet('tiles', 'assets/basictiles.png',
                              {frameWidth:  16, frameHeight: 16, startFrame: 0});
        this.load.spritesheet('characters', 'assets/characters.png',
                              {frameWidth:  16, frameHeight: 16});
        this.load.tilemapTiledJSON('tilemap', 'assets/untitled.json');
    }

    create() {
        this.gameStarted=false;
        this.add.image(540, 300, 'background');
        this.add.text(340,80, 'Peace', { fill: '#ffc300', fontSize:'100px'});
        let btnStart = this.add.sprite(480, 300, 'Start_button').setInteractive();
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


        //btnStart.setDisplaySize(32,32);
        //btnStart.on('pointerover', function (event) { btnStart.setTexture('imgButtonStartHover');/* Do something when the mouse enters */ });
        //btnStart.on('pointerout', function (event) { btnStart.setTexture('imgButtonStartNormal');/* Do something when the mouse exits. */ });
        btnStart.on('pointerdown', function(event){
          if(this.gameStarted==false) {
            this.gameStarted=true
            console.log('game start');
            this.scene.start('gameScene');
            this.scene.start('guiScene');
          }


        }, this);
    }

    update() {
      if (this.enter.isDown) {
        if(this.gameStarted==false) {
          this.gameStarted=true
          console.log('game start');
          this.scene.start('gameScene');
          this.scene.start('guiScene');
        }

      }
    }


}
