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
            "macieira_vazia", "pereira", "abrico", "cerejeira_vazia","cerejeira_cheia", "pereira_vazia", "pereira_cheia",
             "nectarina", "pessegueiro", "laranjeira", "abrico2", "atemoia", "coqueiro_vazio", "coqueiro_cheio", "mangueira_vazia", "mangueira_cheia"
        ]
    },

    animais: {
        path: "assets/animal/",
        files: ["vaca", "galo", "ovelha", "porco", "galinha"]
    },

    decoracoes: {
        path: "assets/decoracao/",
        files: ["anao_jardim", "banco_branco", "banco_marrom", "banheiro", "barril", "caixa_correio",
            "cerca_azul256", "carro", "cerca_verde", "cerca_madeira256", "toras", "cabana_rosa",
            "galinheiro", "estufa", "moinho", "super_armazem", "rede_praia", "feno_preto", "feno_verde",
            "armazem", "estabulo", "bangalo", "banco_branco", "banco_marrom", "feno_rosa", "feno_anil", 
            "feno_branco", "balanco", "banheiro", "barraca_frutas", "bebedouro", "bebedouro_alto", "caixa_areia", "canteiro",
            "carrinho_mao", "carro_amarelo", "carroca", "carrossel", "carrocao", "casa_passarinho", "casarao_vermelho",
            "casinha", "cavalinho", "cortador_grama_vermelho", "balanco2", "escorregador", "fusca_vermelho", "grelha", "lenha_machado",
            "mini_fabrica", "moinho2", "poco", "poste_branco", "poste_preto", "roda_quebrada", "templo", "trepa",
            "banheiro", "barracao_azul", "barracao_marrom", "barracao_rosa", "barril", "feno_vermelho",
            "barril", "caixote", "flamingo", "relogio_sol", "pilao", "feno_anil", "feno_azul", 
            "feno_amarelo", "fusca_vermelho",
            "cerca_verde256", "cerca_preta256", "cerca_branca256", "cerca_rosa256", "cerca_preta256",
             "silo", "bancada_ferramentas"

        ]
    },

    veiculos: {
        path: "assets/veiculo/",
        files: [
            "trator",
            "trator2",
            "trator3",
            "trator_azul",
            "trator_amarelo256",
            "trator_amarelo400",
            "trator_verde400",
            "trator_vermelho"

        ]
    }
}