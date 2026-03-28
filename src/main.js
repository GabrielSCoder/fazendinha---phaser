import { Start } from './scenes/Start.js';
import { Menu } from './scenes/Menu.js';
import { Loading } from './scenes/Loading.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1080,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        // Menu,
        Loading,
        Start
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    fps: {
        target: 75,
        forceSetTimeOut: true
    }
}

new Phaser.Game(config);
