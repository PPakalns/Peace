export class GuiScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'guiScene'});
        this.peaceFulness = 100;
        this.progressLocX = 10;
        this.progressLocY = 10;

    }

    preload() {

        //load tilemaps for items and other stuff


    }

    create ()
    {
        this.peaceFulness = 100;
        //Box for picked item
        let pickedItemBox = this.add.graphics();
        pickedItemBox.setScrollFactor(0);
        pickedItemBox.fillStyle(0x900c3f, 0.8);
        pickedItemBox.fillRect(this.progressLocX + 335, this.progressLocY ,this.progressLocX + 40, this.progressLocY + 40)
        this.pickedItem = this.add.sprite(this.progressLocX + 360,this.progressLocY + 25,'tiles');
        this.pickedItem.setScrollFactor(0);
        this.pickedItem.setVisible(false);
        this.pickedItem.setScale(2,2);
        //Peacefulness bar

        let progressBox = this.add.graphics();
        progressBox.setScrollFactor(0);
        let progressBar = this.add.graphics();
        progressBar.setScrollFactor(0);
        let progressText = this.add.text( this.progressLocX + 130 , this.progressLocY + 15, "Peace" ,{font: '20px monospace',fill: '#ffc300'})
        progressText.setScrollFactor(0);
        progressBox.fillStyle(0x900c3f, 0.8);//0.8);
        progressBox.fillRect(this.progressLocX, this.progressLocY, this.progressLocX + 310, this.progressLocY + 40);
        progressBar.fillStyle(0x581845, 1);
        progressBar.fillRect(this.progressLocX + 10, this.progressLocY + 10, this.peaceFulness*3, this.progressLocY + 20);
        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('gameScene');
        //console.log("Peace: " + this.peaceFulness)
        //  Listen for events from it
        ourGame.events.removeAllListeners("removePeacefulness");
        ourGame.events.removeAllListeners("pickUp");
        ourGame.events.removeAllListeners("placeDown");
        ourGame.events.on("peacefulness", function (value) {
              this.peaceFulness = value;
              if (this.peaceFulness<=0){
                console.log("game over");
                this.scene.pause('gameScene');
                let gameOverText = this.add.text( 100 , 100, "Game Over!" , {font: '50px monospace',fill: '#ffffff'})
                let timedEvent = this.time.addEvent({delay: 2000, callback: function(){
                                                            this.scene.stop('gameScene');
                                                            this.scene.start('menuScene');
                                                            this.scene.stop('guiScene');
                                                          }, callbackScope:this});
              }
              progressBar.clear();
              progressBar.fillStyle(0x581845, 1);
              progressBar.fillRect(this.progressLocX + 10, this.progressLocY + 10, this.peaceFulness*3 , this.progressLocY + 20);
        }, this);
        // pick up item - pickUp event
        ourGame.events.on("pickUp", function (item) {
              console.log("Picked up. Tilemap: " + item.key + " TileID: " + item.value);
              this.pickedItem.setTexture(item.key, item.value - 1)
              this.pickedItem.setVisible(true);
        }, this);
        //Place down picked up item - placeDown event
        ourGame.events.on("placeDown", function () {
              console.log("Placed down")
              this.pickedItem.setVisible(false);
              //this.pickedItem = this.add.sprite(100, 100, 'tiles', 2);
        }, this);

    }
}
