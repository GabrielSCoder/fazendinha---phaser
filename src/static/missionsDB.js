export const intro_missions = [
    {
        id: 1,
        title: "Começando",
        unlocks: [2],
        level_requirement: 1,
        auto_start: true,
        icon: "enxada",

        description: "Primeiro passo para cultivar é preparando o terreno",

        states: [
            {
                objectives: [
                    {
                        action: "plow",
                        amount: 4,
                        text: "Are 4 solos",
                        target: "solo_preparado",
                        icon: "enxada"
                    },
                ]
            }
        ],

        final_reward: {
            xp: 10
        },

        duration: null,
        expires: false
    },
    {
        id: 2,
        title: "Experimentação",
        unlocks: null,
        auto_start: true,
        icon: "semente_abacaxi",

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
    },
    {
        id: 3,
        title: "Reflorestamento",
        unlocks: null,
        level_requirement: 5,
        auto_start: true,
        icon: "abrico",

        description: "Arborize sua fazenda",

        states: [
            {
                objectives: [
                    {
                        action: "place",
                        amount: 10,
                        text: "Plante 10 árvores",
                        target : "arvore",
                        icon: "abrico"
                    },
                    {
                        action: "harvest",
                        amount: 10,
                        text: "colha 10 árvores de abricó",
                        target: "arvore",
                        filters : { name : "arvore_abrico"},
                        icon: "abrico"
                    }
                ],
            }
        ],

        final_reward: {
            xp: 200,
            gold: 300
        }
    }
]