export default class ControlBar {

    constructor(scene) {
        this.scene = scene;
    }

    criarBarraProgresso(x, y, largura, altura, duracaoSegundos, funcao) {

        let cancelled = false;

        const barra = this.scene.add.graphics();
        barra.fillStyle(0x000000, 0.5);
        barra.fillRect(x, y, largura, altura);
        barra.setAlpha(0);

        const progresso = this.scene.add.graphics();
        progresso.setAlpha(0);

        barra.setDepth(1999);
        progresso.setDepth(1999);

        this.scene.cameraController.ignoreInUICamera([progresso, barra]);

        const fadeIn = this.scene.tweens.add({
            targets: [barra, progresso],
            alpha: 1,
            duration: 300,
            ease: "Sine.easeOut"
        });

        let elapsed = 0;

        const timer = this.scene.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {

                if (cancelled) return;

                elapsed += 0.1;

                const ratio = Phaser.Math.Clamp(
                    elapsed / duracaoSegundos,
                    0,
                    1
                );

                progresso.clear();
                progresso.fillStyle(0xeb4034);
                progresso.fillRect(
                    x + 1,
                    y + 1,
                    (largura - 2) * ratio,
                    altura - 2
                );

                if (ratio >= 1) {

                    timer.remove();

                    const fadeOut = this.scene.tweens.add({
                        targets: [barra, progresso],
                        alpha: 0,
                        duration: 500,
                        ease: "Sine.easeIn",
                        onComplete: () => {

                            barra.destroy();
                            progresso.destroy();


                            if (typeof funcao === "function" && !cancelled) {
                                funcao();
                            }

                        }
                    });

                }

            }
        });


        const cancel = () => {

            cancelled = true;

            timer.remove();

            fadeIn.stop();

            this.scene.tweens.killTweensOf([barra, progresso]);

            if (barra && barra.scene) barra.destroy();
            if (progresso && progresso.scene) progresso.destroy();

        };

        return {
            cancel,
            barra,
            progresso
        };
    }
}