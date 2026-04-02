export const intro_missions = [
    {
        id: 1,
        title: "Experimentação",
        level_requirement: 1,
        unlocks: [5],
        auto_start: true,
        icon: "semente_mirtilo",

        description: "Hora de conhecer as sementes",

        states: [
            {
                objectives: [
                    {
                        action: "plant",
                        amount: 2,
                        text: "Plante mirtilos",
                        target: "solo_plantado_simples",
                        filters: { seed: "mirtilo" }
                    },
                    {
                        action: "plant",
                        amount: 2,
                        text: "Plante soja",
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
                        text: "Colha mirtilos",
                        target: "solo_plantado_simples",
                        filters: { seed: "mirtilo" }
                    },
                    {
                        action: "harvest",
                        amount: 2,
                        text: "Colha soja",
                        target: "solo_plantado_simples",
                        filters: { seed: "soja" }
                    }
                ],

                reward: { xp: 20 }
            }
        ],

        final_reward: {
            xp: 30,
            gold: 150
        }
    },
    {
        id: 2,
        title: "Experimentação II",
        unlocks: null,
        auto_start: true,
        icon: "enxada",
        need_mission_complete: 5,

        description: "Hora de aumentar a plantação",

        states: [
            {
                objectives: [
                    {
                        action: "plow",
                        amount: 4,
                        text: "Are solos",
                        target: "solo_preparado",
                        icon: "enxada"
                    },
                    {
                        action: "plant",
                        amount: 4,
                        text: "Plante pimentão",
                        target: "solo_plantado_simples",
                        filters: { seed: "pimentão" }
                    },
                    {
                        action: "harvest",
                        amount: 4,
                        text: "Colha pimentão",
                        target: "solo_plantado_simples",
                        filters: { seed: "pimentão" }
                    }
                ]
            },

        ],

        final_reward: {
            xp: 100,
            gold: 500
        },

        duration: null,
        expires: false
    },
    {
        id: 3,
        title: "Reflorestamento",
        unlocks: [4],
        level_requirement: 5,
        auto_start: true,
        icon: "abrico_cheio",

        description: "Arborize sua fazenda",

        states: [
            {
                objectives: [
                    {
                        action: "place",
                        amount: 5,
                        text: "Plante árvores",
                        target: "arvore",
                        icon: "abrico_vazio"
                    },
                    {
                        action: "harvest",
                        amount: 5,
                        text: "Colha frutos das árvores",
                        target: "arvore",
                        icon: "abrico_cheio"
                    }
                ],
            }
        ],

        final_reward: {
            xp: 100,
            gold: 900
        }
    },
    {
        id: 4,
        title: "Reflorestamento II",
        unlocks: null,
        level_requirement: 8,
        auto_start: false,
        need_mission_complete: 3,
        icon: "bananeira_cheia",

        description: "Vai uma banana?",

        states: [
            {
                objectives: [
                    {
                        action: "place",
                        amount: 5,
                        text: "Plante bananeiras",
                        target: "arvore",
                        icon: "bananeira_cheia",
                        filters: { name: "bananeira" }
                    },
                    {
                        action: "harvest",
                        amount: 5,
                        text: "Colha bananas",
                        target: "arvore",
                        icon: "bananeira_cheia",
                        filters: { name: "bananas" }
                    }
                ],
            }
        ],

        final_reward: {
            xp: 100,
            gold: 900
        }
    },
    {
        id: 5,
        title: "Arando e Arando",
        unlocks: [2],
        auto_start: false,
        icon: "solo2",
        need_mission_complete : 1,
        description: "Prepare o solo para o replantio",

        states: [
            {
                objectives: [
                    {
                        action: "renew",
                        amount: 4,
                        text: "Renove o solo ",
                        target: "solo_preparado",
                        icon: "solo2"
                    }
                ],
            }
        ],

        final_reward: {
            xp: 100,
            gold: 200
        }
    },
]