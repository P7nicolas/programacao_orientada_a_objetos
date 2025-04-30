import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { Chave, Martelo, Lanterna } from "./FerramentasDemo.js";

export class Armario extends Objeto {
    constructor() {
        super("armario", "O armário está fechado", "O armário está aberto. Você encontrou uma lanterna dentro.");
        this.lanterna = new Lanterna(); // Adiciona a lanterna dentro do armário
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof Chave) { // Verifica se a ferramenta é uma chave
            this.acaoOk = true; // Marca que o armário foi aberto
            console.log("O armário foi aberto com a chave! Você encontrou uma lanterna dentro.");
            return this.lanterna; // Retorna a lanterna como item encontrado
        }
        console.log("Você precisa de uma chave para abrir o armário.");
        return false; 
    }
}
// ---------------------------------------------
export class Bilhete extends Objeto {
    constructor() {
        super("bilhete", "Está escuro demais para ler.", "A vida é doce!");
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        return false;
    }
}

// ---------------------------------------------
export class PoteDeAcucar extends Objeto {
	constructor() {
		super("pote_de_acucar","O pote de açúcar esta fechado",
			  "O pote de açúcar esta quebrado. Tinha um diamante dentro!");
	}

	usar(ferramenta) {
        validate(ferramenta,Ferramenta);
		console.log(ferramenta.nome);
		if (ferramenta instanceof Martelo) {
			this.acaoOk = true;
			return true;
		}
		return false;
	}
}
// ---------------------------------------------
export class PoteDeArroz extends Objeto {
	constructor() {
		super("pote_de_arroz","O pote de arroz esta fechado",
			  "O pote de arroz esta quebrado. Tem arroz espalhado por todo lado");
	}

	usar(ferramenta) {
        validate(ferramenta,Ferramenta);
		if (ferramenta instanceof Martelo) {
			this.acaoOk = true;
			return true;
		}
		return false;
	}
}
// ---------------------------------------------
export class Gaveta extends Objeto {
    constructor() {
        super("gaveta", "A gaveta está fechada", "A gaveta está aberta, revelando um martelo dentro.");
        this.martelo = new Martelo(); // Martelo guardado dentro da gaveta
    }

    usar() {
        if (!this.acaoOk) {
            console.log("A gaveta foi aberta! Você encontrou um martelo dentro.");
            this.acaoOk = true;
            return this.martelo; // Retorna o martelo para adicionar à sala
        } else {
            console.log("A gaveta já está aberta e vazia.");
            return null;
        }
    }
}
// ---------------------------------------------
export class Cofre extends Objeto {
    constructor() {
        super("cofre", "O cofre está trancado e você não consegue enxergar bem para abri-lo.", "O cofre está aberto, mas ele está vazio.");
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof Lanterna) {
            this.acaoOk = true; // Marca que o cofre foi aberto
            console.log("Você usou a lanterna para abrir o cofre.");
            return true;
        }
        console.log("Você precisa de uma lanterna para abrir o cofre.");
        return false;
    }
}
// ---------------------------------------------
