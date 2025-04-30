import {Engine} from "./Basicas.js"
import { Cozinha, HallEntrada, Quarto, SalaDeEstar, Biblioteca, SalaSecreta } from "./SalasDemo.js";

export class JogoDemo extends Engine{
    constructor(){
        super();
    }

    criaCenario(){
        // Define as salas que compõem o mapa
        let hall = new HallEntrada(this);
        let sala = new SalaDeEstar(this);
        let quarto = new Quarto(this);
        let cozinha = new Cozinha(this);
        let biblioteca = new Biblioteca(this); 
        let salaSecreta = new SalaSecreta(this);

        // Encadeia as salas através das portas
        hall.portas.set(sala.nome,sala);
        sala.portas.set(hall.nome,hall);
        sala.portas.set(quarto.nome,quarto);
        sala.portas.set(cozinha.nome,cozinha);
        quarto.portas.set(sala.nome,sala);
        cozinha.portas.set(sala.nome,sala);
        sala.portas.set(biblioteca.nome, biblioteca); 
        biblioteca.portas.set(sala.nome, sala); 
        biblioteca.portas.set(salaSecreta.nome, salaSecreta); 
        salaSecreta.portas.set(biblioteca.nome, biblioteca);

        // Define a sala inicial
        this.salaCorrente = hall;
    }
}
