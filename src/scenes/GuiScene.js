export class GuiScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'guiScene'});
        this.peaceFulness = 100;
        this.progressLocX = 10;
        this.progressLocY = 10;
    }

    preload() {
        //this.load.image('Start_button', 'assets/Start_button.png')
        //this.load.image('background','assets/background.png')


    }

    create ()
    {
        //  Our Text object to display the Score
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
    }
}
