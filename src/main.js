import { Start } from './scenes/Start.js';
import {Farm} from './scenes/farm.js';
import {IsoTest} from './scenes/IsoTest.js';
import {OrtoTest} from "./scenes/ortoTest.js";
import {CameraTeste} from "./scenes/cameraTeste.js"

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
        IsoTest
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            