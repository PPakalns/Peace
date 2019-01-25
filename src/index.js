import 'phaser';

import { GameScene } from './scenes/GameScene';

const gameConfig = {
    width: 1080,
    height: 600,
    scene: [GameScene],
};

new Phaser.Game(gameConfig);
