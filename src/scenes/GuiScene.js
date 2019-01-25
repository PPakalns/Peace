export class GuiScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'guiScene'});
        this.peaceFulness = 100;
    }

    preload() {
        //this.load.image('Start_button', 'assets/Start_button.png')
        //this.load.image('background','assets/background.png')
    }

    create ()
    {
        //  Our Text object to display the Score
        let info = this.add.text(200, 200, 'Score: ' + this.peaceFulness, { font: '48px Arial', fill: '#FFF' });
        info.setScrollFactor(0);


        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('gameScene');

        //  Listen for events from it
        ourGame.events.on('addScore', function () {

            this.peaceFulness += 10;

            info.setText('Score: ' + this.peaceFulness);

        }, this);
    }
}
