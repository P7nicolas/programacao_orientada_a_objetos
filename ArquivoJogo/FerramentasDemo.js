import {Ferramenta} from "./Basicas.js";

// ---------------------------------------------
export class Chave extends Ferramenta {
	constructor() {
		super("chave");
	}
}
// ---------------------------------------------
export class Martelo extends Ferramenta {
	constructor() {
		super("martelo");
	}
}
// ---------------------------------------------
export class Lanterna extends Ferramenta {
    #usosRestantes;

    constructor() {
        super("lanterna");
        this.#usosRestantes = 2; 
    }

    usar() {
        if (this.#usosRestantes > 0) {
            this.#usosRestantes -= 1;
            console.log(`Você usou a lanterna. Restam ${this.#usosRestantes} usos.`);
            return true;
        } else {
            console.log("A bateria da lanterna acabou!");
            return false;
        }
    }

    get estaSemBateria() {
        return this.#usosRestantes <= 0;
    }
}
// ---------------------------------------------
