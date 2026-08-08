export const achievements_example = [
    {
        "id": 1,
        "title": "",
        "description": "",
        "active": true,
        "no_states": 5,
        "states": [
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 30,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 80,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 150,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 220,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 300,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
        ],
        "final_reward": {
            "xp": 30,
            "gold": 150
        }
    }
]

export const achievements = [
    {
        "id": 1,
        "title": "Semeador",
        "description": "Semeie terrenos com plantas variadas",
        "active": true,
        "img": "trofeu_semente",
        "states": [
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 30,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 80,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 150,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            }
        ],
        "final_reward": {
            "xp": 30,
            "gold": 150
        }
    },
    {
        "id": 2,
        "title": "Amigo das árvores",
        "description": "Plante árvores",
        "active": true,
        "img": "trofeu_arvore",
        "states": [
            {
                "objectives": [
                    {
                        action: "place",
                        amount: 10,
                        target: "arvore",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "place",
                        amount: 20,
                        target: "arvore",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "place",
                        amount: 30,
                        target: "arvore",
                    }
                ],

                reward: { xp: 20 }
            }
        ],
        "final_reward": {
            "xp": 400,
            "gold": 1500
        }
    },
    {
        "id": 3,
        "title": "Gastador",
        "description": "Gaste seu ouro",
        "active": true,
        "img": "trofeu_gastador",
        "states": [
            {
                "objectives": [
                    {
                        action: "transaction",
                        amount: 5000,
                        target: "gold",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "transaction",
                        amount: 10000,
                        target: "gold",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "transaction",
                        amount: 30000,
                        target: "gold",
                    }
                ],

                reward: { xp: 20 }
            }
        ],
        "final_reward": {
            "xp": 30,
            "gold": 150
        }
    },
    {
        "id": 4,
        "title": "Colecionador",
        "description": "Decore suas fazenda",
        "active": false,
        "img": "trofeu_colecionador",
        "states": [
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 30,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 80,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            },
            {
                "objectives": [
                    {
                        action: "plant",
                        amount: 150,
                        target: "solo_plantado_simples",
                    }
                ],

                reward: { xp: 20 }
            }
        ],
        "final_reward": {
            "xp": 30,
            "gold": 150
        }
    }
]