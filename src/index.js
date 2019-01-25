import 'phaser';

import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';

const gameConfig = {
    width: 1080,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    scene: [MenuScene, GameScene, GuiScene]
};

new Phaser.Game(gameConfig);
