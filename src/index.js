import 'phaser';

import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';
import { GuiScene } from './scenes/GuiScene';

var gameConfig = {
    width: 1080,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    scene: [MenuScene, GameScene, GuiScene]
};

var game = new Phaser.Game(gameConfig);

function resize() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  console.log(windowWidth, windowHeight, windowRatio, gameRatio)
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  } else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}

setTimeout(resize, 100);
window.addEventListener("resize", resize, false);

