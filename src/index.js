import 'phaser';

import { GameScene } from './scenes/GameScene';

const gameConfig = {
    width: 1080,
    height: 600,
    pixelArt: true,
    scene: [GameScene],
};

new Phaser.Game(gameConfig);
