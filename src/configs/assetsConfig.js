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
        path: "assets/solo/solo_pronto512/",
        prefix: "pronto_",

        files: [
            "abacaxi", "abobora", "abobora_moranga", "algodao", "alho",
            "arroz", "framboesa", "batata_inglesa", "batata_doce",
            "cebola", "cafe", "couve_flor", "girassol", "melancia",
            "milho", "mirtilo", "morango", "nabo", "pimenta",
            "pimentao", "rabanete", "trigo", "cenoura", "soja",
            "tomate", "alcachofra", "espinafre", "aloe_vera", "uva", "berinjela"
        ],

        getFile: name => {

            if (name === "batata_inglesa") return "solo_pronto_batata.png"

            return `solo_pronto_${name}.png`
        }
    },

    arvores: {
        path: "assets/arvore/",
        files: [
            "macieira_vazia", "macieira_cheia", "abrico_cheio", "abrico_vazio", "cerejeira_vazia", "cerejeira_cheia", "pereira_vazia", "pereira_cheia",
            "nectarina_vazia", "nectarina_cheia", "pessegueiro_vazio", "pessegueiro_cheio", "laranjeira_cheia", "laranjeira_vazia", "atemoia_vazia", "atemoia_cheia", "coqueiro_vazio", "coqueiro_cheio",
            "mangueira_vazia", "mangueira_cheia", "bananeira_vazia", "bananeira_cheia"
        ]
    },

    animais: {
        path: "assets/animal/",
        files: ["vaca", "galo", "ovelha", "porco", "galinha", "bufalo", "cisne", "coelho",
            "coelho2", "elefante", "galinha2", "galinha3", "galinha5", "galinha6", "girafa",
            "leao", 'leoa', "panda", "patinho", "pato_branco", "pato_feio", "pato_real", "zebra"
        ]
    },

    decoracoes: {
        path: "assets/decoracao/",
        files: ["anao_jardim",
            "armada",
            "balanco",
            "oficina",
            "banco_branco",
            "banco_madeira",
            "banco_marrom",
            "cabana_descanso",
            "barracao",
            "barracao_rosa",
            "banheiro",
            "banheiro_azul",
            "banheiro_rosa",
            "celeiro_azul",
            "celeiro_marrom",
            "celeiro_vermelho",
            "barraca_frutas",
            "barril",
            "bebedouro",
            "bebedouro_alto",
            "bebedouro_passaro",
            "cadeira_camping",
            "caixa_areia",
            "caixa_correio",
            "caixa_correio_tijolos",
            "caixote",
            "caminhao",
            "canteiro",
            "canteiro_flores",
            "canteiro_flores_mistas",
            "carro_amarelo",
            "carro_vermelho",
            "carroca",
            "carroca2",
            "carroca_coberta",
            "carroca_entulho",
            "carroca_ouro",
            "carrocao",
            "carrossel",
            "carrinho_mao",
            "cabana",
            "cabana_rosa",
            "casa_grande",
            "casa_cogumelo",
            "casa_fazenda",
            "casa_passarinho",
            "casa_grande_rosa",
            "cavalinho",
            "cerca_azul256",
            "cerca_branca256",
            "cerca_madeira256",
            "cerca_preta256",
            "cerca_preta256",
            "cerca_rosa256",
            "cerca_verde",
            "cerca_verde256",
            "cortador_grama_vermelho",
            "escada_sinuosa",
            "escorregador",
            "espantalho_azul",
            "espantalho_palha",
            "espantalho_preto",
            "espantalho_vermelho",
            "estabulo_of",
            "estufa",
            "feno_amarelo",
            "feno_anil",
            "feno_azul",
            "feno_branco",
            "feno_preto",
            "feno_rosa",
            "feno_verde",
            "feno_vermelho",
            "flamingo",
            "gangorra",
            "gazebo",
            "gazebo_rosa",
            "grelha",
            "furgao_azul",
            "furgao_rosa",
            "lampiao",
            "leiteiro",
            "machado_pedra",
            "mini_fabrica",
            "mochilao",
            "moinho_vento",
            "muro_plantas",
            "muro_tijolos",
            "batedeira_manteiga",
            "pilha_madeira",
            "poco",
            "poste_branco",
            "poste_preto",
            "rede_praia",
            "relogio_sol",
            "roda_carroca",
            "silo",
            "templo",
            "barraca_iglu",
            "barraca_canadense",
            "cesta_piquenique",
            "tocha",
            "trailer"
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