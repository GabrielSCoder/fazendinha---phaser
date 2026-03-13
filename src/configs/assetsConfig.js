export const assetsConfig = {

    sementes: {
        path: "assets/semente/",
        prefix: "semente_",
        files: [
            "abacaxi", "abobora", "abobora_moranga", "algodao", "alho",
            "amora", "arroz", "uva", "framboesa", "batata_inglesa",
            "batata_doce", "cebola", "berinjela", "beterraba",
            "cafe", "couve_flor", "girassol", "melancia",
            "milho", "mirtilo", "morango", "nabo", "pimenta",
            "pimentao", "rabanete", "trigo", "cenoura",
            "soja", "tomate", "alcachofra", "espinafre", "aloe_vera"
        ],

        getFile: name => `icone_${name}.png`
    },

    plantasProntas: {
        path: "assets/solo/solo_pronto/",
        prefix: "pronto_",

        files: [
            "abacaxi", "abobora", "abobora_moranga", "algodao", "alho",
            "arroz", "framboesa", "batata_inglesa", "batata_doce",
            "cebola", "cafe", "couve_flor", "girassol", "melancia",
            "milho", "mirtilo", "morango", "nabo", "pimenta",
            "pimentao", "rabanete", "trigo", "cenoura", "soja",
            "tomate", "alcachofra", "espinafre", "aloe_vera"
        ],

        getFile: name => {

            if (name === "batata_inglesa") return "solo_pronto_batata.png"
            if (name === "pimentao") return "solo_pronto_pimenta.png"

            return `solo_pronto_${name}.png`
        }
    },

    arvores: {
        path: "assets/arvore/",
        files: [
            "macieira", "pereira", "abrico", "cerejeira",
            "coqueiro", "nectarina", "pessegueiro", "laranjeira"
        ]
    },

    animais: {
        path: "assets/animal/",
        files: ["vaca", "galo", "ovelha", "porco"]
    },

    decoracoes: {
        path: "assets/decoracao/",
        files: [
            "cerca_branca", "carro", "cerca_verde",
            "galinheiro", "estufa", "moinho",
            "armazem", "estabulo", "bangalo"
        ]
    },

    veiculos: {
        path: "assets/veiculo/",
        files: [
            "trator",
            "trator2",
            "trator3"
        ]
    }
}