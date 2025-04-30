import {validate} from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({sigint: true});
// ---------------------------------------------
export class Ferramenta {
	#nome;

	constructor(nome) {
        validate(nome,"String");
		this.#nome = nome;
	}

	get nome() {
		return this.#nome;
	}
	
	usar() {
		return true;
	}
}

// ---------------------------------------------
export class Objeto {
	#nome;
    #descricaoAntesAcao;
    #descricaoDepoisAcao;
    #acaoOk;
    	
	constructor(nome,descricaoAntesAcao, descricaoDepoisAcao) {
		validate(arguments,["String","String","String"]);
		this.#nome = nome;
		this.#descricaoAntesAcao = descricaoAntesAcao;
		this.#descricaoDepoisAcao = descricaoDepoisAcao;
		this.#acaoOk = false;
	}
	
	get nome(){
		return this.#nome;
	}

	get acaoOk() {
		return this.#acaoOk;
	}

	set acaoOk(acaoOk) {
		validate(acaoOk,"Boolean");
		this.#acaoOk = acaoOk;
	}

	get descricao() {
		if (!this.acaoOk) {
			return this.#descricaoAntesAcao;
		}else {
			return this.#descricaoDepoisAcao;
		}
	}

	usar(ferramenta){
	}
}
// ---------------------------------------------
export class Sala {
    #nome;
    #objetos;
    #ferramentas;
    #portas;
    #engine;

    constructor(nome, engine) {
        validate(arguments, ["String", Engine]);
        this.#nome = nome;
        this.#objetos = new Map();
        this.#ferramentas = new Map();
        this.#portas = new Map();
        this.#engine = engine;
    }

    get nome() {
        return this.#nome;
    }

    get objetos() {
        return this.#objetos;
    }

    get ferramentas() {
        return this.#ferramentas;
    }

    get portas() {
        return this.#portas;
    }

    get engine() {
        return this.#engine;
    }

    objetosDisponiveis() {
        let arrObjs = [...this.#objetos.values()];
        return arrObjs.map(obj => obj.nome + ":" + obj.descricao);
    }

    ferramentasDisponiveis() {
        let arrFer = [...this.#ferramentas.values()];
        return arrFer.map(f => f.nome);
    }

    portasDisponiveis() {
        let arrPortas = [...this.#portas.values()];
        return arrPortas.map(sala => sala.nome);
    }

    pega(nomeFerramenta) {
        validate(nomeFerramenta, "String");
        let f = this.#ferramentas.get(nomeFerramenta);
        if (f != null) {
            this.#engine.mochila = f;
            this.#ferramentas.delete(nomeFerramenta);
            return true;
        } else {
            return false;
        }
    }

    sai(porta) {
        validate(porta, "String");
        return this.#portas.get(porta);
    }

    textoDescricao() {
        let descricao = "Você está no " + this.nome + "\n";
        if (this.objetos.size == 0) {
            descricao += "Não há objetos na sala\n";
        } else {
            descricao += "Objetos: " + this.objetosDisponiveis() + "\n";
        }
        if (this.ferramentas.size == 0) {
            descricao += "Não há ferramentas na sala\n";
        } else {
            descricao += "Ferramentas: " + this.ferramentasDisponiveis() + "\n";
        }
        descricao += "Portas: " + this.portasDisponiveis() + "\n";
        return descricao;
    }

    usa(ferramenta) {
        if (ferramenta.nome === "martelo") {
            // Remover o martelo da mochila após uso
            const index = this.#engine.mochila.findIndex(ferramenta => ferramenta.nome === "martelo");
            if (index !== -1) {
                this.#engine.mochila.splice(index, 1);  // Remove o martelo da mochila
                console.log("Martelo foi removido da mochila.");
            }

            // Remover o martelo da sala se ele estiver nela (caso seja um objeto específico da sala)
            this.#ferramentas.delete("martelo");
            console.log("Martelo foi removido da sala.");

            return true; // Sucesso ao usar o martelo
        }
        return false; // Caso não tenha sido o martelo
    }
}
// ---------------------------------------------
export class Engine {
    #mochila;  // A mochila armazena as ferramentas
    #salaCorrente;
    #fim;

    constructor() {
        this.#mochila = [];  // Inicializando a mochila vazia
        this.#salaCorrente = null;
        this.#fim = false;
        this.criaCenario();
    }

    get mochila() {
        return this.#mochila;
    }

    set mochila(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (this.#mochila.length < 2) {
            this.#mochila.push(ferramenta);
        } else {
            console.log("Sua mochila está cheia! Você não pode carregar mais de duas ferramentas.");
        }
    }

    get salaCorrente() {
        return this.#salaCorrente;
    }

    set salaCorrente(sala) {
        validate(sala, Sala);
        this.#salaCorrente = sala;
    }

    indicaFimDeJogo(vitoria) {
        this.#fim = true;
        if (vitoria) {
            console.log("Parabéns, você venceu!");
        } else {
            console.log("Você perdeu o jogo!");
        }
    }

    criaCenario() {}

    removeFerramenta(nomeFerramenta) {
        const index = this.#mochila.findIndex(ferramenta => ferramenta.nome === nomeFerramenta);
        if (index !== -1) {
            this.#mochila.splice(index, 1);
            console.log(nomeFerramenta + " foi removido da mochila.");
        } else {
            console.log(nomeFerramenta + " não está na mochila.");
        }
    }

    joga() {
		let novaSala = null;
		let acao = "";
		let tokens = null;
		while (!this.#fim) {
			console.log("-------------------------");
			console.log(this.salaCorrente.textoDescricao());
			acao = prompt("O que você deseja fazer? ");
			tokens = acao.split(" ");
			switch (tokens[0]) {
				case "fim":
					this.#fim = true;
					break;
				case "pega":
					if (this.salaCorrente.pega(tokens[1])) {
						console.log("Ok! " + tokens[1] + " guardado!");
					} else {
						console.log("Objeto " + tokens[1] + " não encontrado.");
					}
					break;
				case "remove":
					this.removeFerramenta(tokens[1]);
					break;
				case "inventario":
					console.log("Ferramentas na mochila: " + this.#mochila.map(ferramenta => ferramenta.nome).join(", "));
					break;
				case "usa":
					if (this.salaCorrente.usa(tokens[1])) {
						console.log("Feito!!");
						if (this.#fim) {
							console.log(this.#fim ? "Jogo encerrado!" : "Você perdeu o jogo!");
						}
					} else {
						console.log("Não é possível usar " + tokens[1] + " nesta sala");
					}
					break;
				case "sai":
					novaSala = this.salaCorrente.sai(tokens[1]);
					if (novaSala == null) {
						console.log("Sala desconhecida ...");
					} else {
						this.#salaCorrente = novaSala;
					}
					break;
				default:
					console.log("Comando desconhecido: " + tokens[0]);
					break;
			}
		}
		console.log("Jogo encerrado!");
	}
}

