export const intro_missions = [
    {
        id: 1,
        title: "Começando",
        unlocks: [2],
        level_requirement: 1,
        auto_start: true,


        description: "Primeiro passo para cultivar é preparando o terreno",

        states: [
            {
                objectives: [
                    {
                        action: "plow",
                        amount: 4,
                        text: "Are 4 solos",
                        target: "solo_preparado",
                        icon : "enxada"
                    },
                ]
            }
        ],

        final_reward: {
            gold: 100,
            xp: 10
        },

        duration: null,
        expires: false
    },

    {
        id: 2,
        title: "Experimentação",
        unlocks: null,
        level_requirement: null,
        auto_start: true,

        description: "Hora de conhecer as sementes",

        states: [
            {
                objectives: [
                    {
                        action: "plant",
                        amount: 2,
                        text: "Plante 2 mirtilos",
                        target: "solo_plantado_simples",
                        filters: { seed: "mirtilo" }
                    },
                    {
                        action: "plant",
                        amount: 2,
                        text: "Plante 2 soja",
                        target: "solo_plantado_simples",
                        filters: { seed: "soja" }
                    }
                ],

                reward: { xp: 20 }
            },

            {
                objectives: [
                    {
                        action: "harvest",
                        amount: 2,
                        text: "Colha 2 mirtilos",
                        target: "solo_plantado_simples",
                        filters: { seed: "mirtilo" }
                    },
                    {
                        action: "harvest",
                        amount: 2,
                        text: "Colha 2 soja",
                        target: "solo_plantado_simples",
                        filters: { seed: "soja" }
                    }
                ],

                reward: { xp: 20 }
            }
        ],

        final_reward: {
            xp: 50,
            gold: 100
        }
    }
]