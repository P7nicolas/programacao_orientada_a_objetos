import { validate } from "bycontract";
import { Sala, Engine, Ferramenta } from "./Basicas.js";
import { Martelo, Chave, Lanterna } from "./FerramentasDemo.js";
import { Armario, Bilhete, PoteDeAcucar, PoteDeArroz, Gaveta, Cofre } from "./ObjetosDemo.js";

export class HallEntrada extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Hall_de_Entrada", engine);

        let gaveta = new Gaveta();
        this.objetos.set(gaveta.nome, gaveta); // Adiciona a gaveta ao hall
    }

    usa(objeto) {
        validate(objeto, "String");
        if (!this.objetos.has(objeto)) {
            return false;
        }
        let gaveta = this.objetos.get(objeto);
        if (gaveta instanceof Gaveta) {
            const item = gaveta.usar(); // Tenta abrir a gaveta
            if (item) {
                this.ferramentas.set(item.nome, item); // Adiciona o martelo ao inventário da sala
                console.log(`Você encontrou um ${item.nome} dentro da gaveta!`);
            }
            return true;
        }
        return false;
    }
}
// ---------------------------------------------
export class SalaDeEstar extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Sala_de_Estar", engine);
        
        let armario = new Armario();
        this.objetos.set(armario.nome, armario); // Adiciona o armário à sala.
    }

    usa(objeto) {
        validate(objeto, "String");
        if (!this.objetos.has(objeto)) {
            return false;
        }
        
        let armario = this.objetos.get(objeto);

        const chaveNaMochila = this.engine.mochila.some(ferramenta => ferramenta instanceof Chave);
        if (chaveNaMochila) {
            const item = armario.usar(this.engine.mochila.find(ferramenta => ferramenta instanceof Chave));
            if (item) {
                this.ferramentas.set(item.nome, item); // Adiciona a lanterna ao inventário da sala
                console.log(`Você encontrou uma ${item.nome} dentro do armário!`);
            }
            return true;
        } else {
            console.log("Você não tem a chave na mochila para abrir o armário.");
            return false; // Não tem a chave, então a ação falha
        }
    }
}
// ---------------------------------------------
export class Quarto extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Quarto", engine);

        // Adiciona a chave como um objeto na sala
        let chave = new Chave(); 
        this.ferramentas.set(chave.nome, chave);

        // Adiciona o bilhete como um objeto na sala
        let bilhete = new Bilhete();
        this.objetos.set(bilhete.nome, bilhete); // Adiciona o bilhete ao quarto
    }

    usa(objeto) {
        validate(objeto, "String");
        if (!this.objetos.has(objeto)) {
            return false;
        }

        const bilhete = this.objetos.get(objeto);
        const lanterna = this.engine.mochila.find(f => f instanceof Lanterna);

        if (bilhete instanceof Bilhete) {
            if (lanterna) {
                if (lanterna.usar()) {
                    console.log(`Você lê o bilhete: "A vida é doce!"`);
                    bilhete.acaoOk = true; 
                } else {
                    this.engine.indicaFimDeJogo(false);
                    console.log("Você perdeu o jogo porque a lanterna está sem bateria!");
                }
                return true;
            } else {
                console.log("Está muito escuro para ler o bilhete. Você precisa de uma lanterna.");
                return false;
            }
        }
        return false;
    }

    pega(nomeObjeto) {
        if (this.ferramentas.has(nomeObjeto)) {
            let objeto = this.ferramentas.get(nomeObjeto);
            if (objeto instanceof Ferramenta) {
                this.engine.mochila.push(objeto); // Coloca a chave na mochila.
                this.ferramentas.delete(nomeObjeto); // Remove da sala
                console.log(`${nomeObjeto} adicionado à mochila.`);
                return true;
            }
        }
        console.log(`Objeto ${nomeObjeto} não encontrado.`);
        return false;
    }
}
// ---------------------------------------------
export class Cozinha extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Cozinha", engine);
        let poteAcucar = new PoteDeAcucar();
        this.objetos.set(poteAcucar.nome, poteAcucar);
        let poteArroz = new PoteDeArroz();
        this.objetos.set(poteArroz.nome, poteArroz);
    }

    usa(objeto) {
        validate(objeto, "String");
        if (!this.objetos.has(objeto)) {
            return false;
        }

        const pote = this.objetos.get(objeto);
        const ferramentaAtual = this.engine.mochila.find(f => f instanceof Martelo);

        if (ferramentaAtual) {
            if (pote.usar(ferramentaAtual)) {
                // Remova o martelo da mochila após o uso
                this.engine.removeFerramenta(ferramentaAtual.nome);
                console.log(ferramentaAtual.nome + " foi usado.");

                if (pote instanceof PoteDeAcucar) {
                    // Vitória: jogador quebra o pote de açúcar
                    this.engine.indicaFimDeJogo(true); // Indica vitória
                } else if (pote instanceof PoteDeArroz) {
                    // Derrota: jogador quebra o pote de arroz
                    console.log("Você quebrou o pote de arroz.");
                    this.engine.indicaFimDeJogo(false); // Indica derrota
                }
                return true;
            }
        } else {
            console.log("Não é possível usar " + (ferramentaAtual ? ferramentaAtual.nome : "essa ferramenta") + " aqui.");
        }

        return false;
    }
}
// ---------------------------------------------
export class Biblioteca extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Biblioteca", engine);
    }
}
// ---------------------------------------------
export class SalaSecreta extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Sala_Secreta", engine);

        let cofre = new Cofre();
        this.objetos.set(cofre.nome, cofre); 
    }

    usa(objeto) {
        validate(objeto, "String");
        if (!this.objetos.has(objeto)) {
            return false;
        }

        const cofre = this.objetos.get(objeto);
        const lanterna = this.engine.mochila.find(f => f instanceof Lanterna);

        if (cofre instanceof Cofre) {
            if (lanterna) {
                if (lanterna.usar()) {
                    console.log(`Você abriu o cofre, mas ele está vazio.`);
                    cofre.acaoOk = true; // Marca o cofre como aberto
                } else {
                    this.engine.indicaFimDeJogo(false);
                    console.log("Você perdeu o jogo porque a lanterna está sem bateria!");
                }
                return true;
            } else {
                console.log("Você precisa de uma lanterna para abrir o cofre.");
                return false;
            }
        }
        return false;
    }
}
