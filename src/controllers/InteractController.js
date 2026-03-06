export default class InteractController {

    constructor(scene, config = {}) {
        this.scene = scene;
        this.uiEvents = config.uiEvents;
        this.classEvents();
    }

    classEvents() {
        this.uiEvents.on("interact:ActivateAll", () => {
            this.ativarInteratividadeItens();
        })

        this.uiEvents.on("interact:DesativateAll", () => {
            this.desativarInteratividadeItens();
        })

        this.uiEvents.on("interact:DesativateExcept", (nome) => {
            this.desativarInteratividadeItensExceto(nome);
        })

        this.uiEvents.on("interact:ActivateByName", (nome) => {
            this.ativarInteratividadeItensPorNome(nome);
        })
    }



    desativarInteratividadeItens() {
        console.log(this.scene.gameVariables.sprites);
        for (let other of this.scene.gameVariables.sprites) {
            if (other !== this.scene.gameVariables.selectedSprite) other.disableInteractive();
        }
    }


    desativarInteratividadeItensExceto(nome) {
        for (let other of this.scene.gameVariables.sprites) {
            if (other !== this.scene.gameVariables.selectedSprite && other.nome !== nome) other.disableInteractive();
        }
    }

    ativarInteratividadeItens() {
        for (let other of this.scene.gameVariables.sprites) {
            other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        }
    }

    ativarInteratividadeItensPorNome(nome) {
        console.log(this.scene.gameVariables.sprites);
        for (let other of this.scene.gameVariables.sprites) {
            if (other.nome === nome) other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        }
    }
}
