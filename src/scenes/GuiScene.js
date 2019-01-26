export class GuiScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'guiScene'});
        this.peaceFulness = 100;
        this.progressLocX = 10;
        this.progressLocY = 10;
        this.pickedItem;


    }

    preload() {

        //load tilemaps for items and other stuff

    }

    create ()
    {
        //  Our Text object to display the Score
        this.pickedItem = this.add.sprite(100,100,'tiles');
        this.pickedItem.setVisible(false);
        let progressBar = this.add.graphics();
        progressBar.setScrollFactor(0);
        let progressBox = this.add.graphics();
        progressBox.setScrollFactor(0);
        let progressText = this.add.text( 100 , 25, "Peacefulness" ,{font: '20px monospace',fill: '#ffffff'})
        progressText.setScrollFactor(0);
        progressBox.fillStyle(0xbed9f4, 0.8);
        progressBox.fillRect(this.progressLocX, this.progressLocY, this.progressLocX + 310, this.progressLocY + 40);
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(this.progressLocX + 10, this.progressLocY + 10, this.peaceFulness*3, this.progressLocY + 20);
        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('gameScene');
        console.log("Peace: " + this.peaceFulness)
        //  Listen for events from it
        ourGame.events.on("removePeacefulness", function () {
              this.peaceFulness -= 0.2;
              console.log("Peace: " + this.peaceFulness)
              progressBar.clear();
              progressBar.fillStyle(0xffffff, 1);
              progressBar.fillRect(this.progressLocX + 10, this.progressLocY + 10, this.peaceFulness*3 , this.progressLocY + 20);
        }, this);
        // pick up item - pickUp event
        ourGame.events.on("pickUp", function (item) {
              console.log("Picked up. Tilemap: " + item.key + " TileID: " + item.value);
              this.pickedItem.setTexture(item.key, item.value)
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
