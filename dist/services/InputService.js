"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputService = void 0;
const readlineSync = __importStar(require("readline-sync"));
const Aluno_1 = require("../models/Aluno");
const Constantes_1 = require("../models/Constantes");
class InputService {
    coletarDadosAluno() {
        console.log('\n=== CADASTRO DE ALUNO ===');
        console.log('Por favor, insira os dados do aluno:\n');
        const nome = this.coletarNome();
        const serie = this.coletarSerie();
        const faltas = this.coletarFaltas();
        const notas = this.coletarNotas();
        return {
            nome,
            serie,
            faltas,
            notas,
            dataCadastro: new Date()
        };
    }
    coletarNome() {
        while (true) {
            const nome = readlineSync.question('Nome do aluno: ').trim();
            if (nome.length === 0) {
                console.log('[ERRO] O nome não pode estar vazio. Tente novamente.');
                continue;
            }
            if (nome.length < 2) {
                console.log('[ERRO] O nome deve ter pelo menos 2 caracteres. Tente novamente.');
                continue;
            }
            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
                console.log('[ERRO] O nome deve conter apenas letras e espaços. Tente novamente.');
                continue;
            }
            return nome;
        }
    }
    coletarSerie() {
        while (true) {
            const serie = readlineSync.question('Série do aluno (ex: 9º ano, 1º ano EM): ').trim();
            if (serie.length === 0) {
                console.log('[ERRO] A série não pode estar vazia. Tente novamente.');
                continue;
            }
            return serie;
        }
    }
    coletarFaltas() {
        while (true) {
            const faltasStr = readlineSync.question(`Número de faltas (máximo ${Constantes_1.CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO}): `);
            const faltas = parseInt(faltasStr);
            if (isNaN(faltas)) {
                console.log('[ERRO] Por favor, insira um número válido para as faltas.');
                continue;
            }
            if (faltas < 0) {
                console.log('[ERRO] O número de faltas não pode ser negativo.');
                continue;
            }
            if (faltas > Constantes_1.CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO) {
                console.log(`[ERRO] O número de faltas não pode exceder ${Constantes_1.CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO}.`);
                continue;
            }
            return faltas;
        }
    }
    coletarNotas() {
        console.log(`\n[MATERIAS] Agora vamos inserir as ${Constantes_1.CONFIG_AVALIACAO.NUMERO_NOTAS_POR_MATERIA} notas para cada matéria:`);
        const notas = {
            [Aluno_1.Materia.MATEMATICA]: [],
            [Aluno_1.Materia.PORTUGUES]: [],
            [Aluno_1.Materia.GEOGRAFIA]: [],
            [Aluno_1.Materia.HISTORIA]: [],
            [Aluno_1.Materia.QUIMICA]: []
        };
        const materias = Object.values(Aluno_1.Materia);
        for (const materia of materias) {
            console.log(`\n--- ${materia} ---`);
            notas[materia] = this.coletarNotasMateria(materia);
        }
        return notas;
    }
    coletarNotasMateria(materia) {
        const notas = [];
        for (let i = 1; i <= Constantes_1.CONFIG_AVALIACAO.NUMERO_NOTAS_POR_MATERIA; i++) {
            while (true) {
                const notaStr = readlineSync.question(`Nota ${i}/8: `);
                const nota = parseFloat(notaStr);
                if (isNaN(nota)) {
                    console.log('[ERRO] Por favor, insira um número válido para a nota.');
                    continue;
                }
                if (nota < 0 || nota > 10) {
                    console.log('[ERRO] A nota deve estar entre 0 e 10.');
                    continue;
                }
                notas.push(nota);
                break;
            }
        }
        return notas;
    }
    confirmarDados(aluno) {
        console.log('\n=== CONFIRMAÇÃO DOS DADOS ===');
        console.log(`Nome: ${aluno.nome}`);
        console.log(`Série: ${aluno.serie}`);
        console.log(`Faltas: ${aluno.faltas}`);
        console.log('\nNotas por matéria:');
        Object.entries(aluno.notas).forEach(([materia, notas]) => {
            const media = notas.reduce((sum, nota) => sum + nota, 0) / notas.length;
            console.log(`${materia}: [${notas.join(', ')}] - Média: ${media.toFixed(2)}`);
        });
        const confirmacao = readlineSync.keyInYNStrict('\nOs dados estão corretos?');
        return confirmacao;
    }
}
exports.InputService = InputService;
//# sourceMappingURL=InputService.js.map