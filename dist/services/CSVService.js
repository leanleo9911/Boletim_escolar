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
exports.CSVService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Aluno_1 = require("../models/Aluno");
class CSVService {
    constructor(diretorio = './data', nomeArquivo = 'alunos.csv') {
        if (!fs.existsSync(diretorio)) {
            fs.mkdirSync(diretorio, { recursive: true });
        }
        this.caminhoArquivo = path.join(diretorio, nomeArquivo);
        this.cabecalhoCSV = [
            'nome',
            'serie',
            'faltas',
            'dataCadastro',
            'notasMatematica',
            'notasPortugues',
            'notasGeografia',
            'notasHistoria',
            'notasQuimica',
            'mediaGeral',
            'percentualPresenca',
            'aprovado',
            'motivoReprovacao'
        ];
        this.inicializarArquivo();
    }
    salvarAluno(aluno, resultado) {
        const registro = this.converterAlunoParaCSV(aluno, resultado);
        const linha = this.converterRegistroParaLinha(registro);
        fs.appendFileSync(this.caminhoArquivo, linha + '\n', 'utf8');
        console.log(`[SUCESSO] Dados do aluno "${aluno.nome}" salvos no arquivo CSV.`);
    }
    carregarAlunos() {
        if (!fs.existsSync(this.caminhoArquivo)) {
            return [];
        }
        const conteudo = fs.readFileSync(this.caminhoArquivo, 'utf8');
        const linhas = conteudo.trim().split('\n');
        if (linhas.length <= 1) {
            return [];
        }
        const registros = [];
        for (let i = 1; i < linhas.length; i++) {
            try {
                const registro = this.converterLinhaParaRegistro(linhas[i]);
                registros.push(registro);
            }
            catch (error) {
                console.warn(`[AVISO] Erro ao processar linha ${i + 1} do CSV: ${error}`);
            }
        }
        return registros;
    }
    listarAlunos() {
        const registros = this.carregarAlunos();
        if (registros.length === 0) {
            console.log('[INFO] Nenhum aluno encontrado no arquivo.');
            return;
        }
        console.log(`\n[LISTA] ALUNOS CADASTRADOS (${registros.length} total):`);
        console.log('-'.repeat(80));
        console.log('Nome'.padEnd(25) + 'Série'.padEnd(15) + 'Média'.padEnd(10) + 'Presença'.padEnd(12) + 'Status');
        console.log('-'.repeat(80));
        registros.forEach((registro) => {
            const status = registro.aprovado ? '[APROVADO] Aprovado' : '[REPROVADO] Reprovado';
            console.log(registro.nome.padEnd(25) +
                registro.serie.padEnd(15) +
                registro.mediaGeral.toFixed(2).padEnd(10) +
                `${registro.percentualPresenca.toFixed(1)}%`.padEnd(12) +
                status);
        });
        console.log('-'.repeat(80));
    }
    gerarRelatorio() {
        const registros = this.carregarAlunos();
        if (registros.length === 0) {
            console.log('[INFO] Não há dados suficientes para gerar relatório.');
            return;
        }
        const aprovados = registros.filter(r => r.aprovado).length;
        const reprovados = registros.length - aprovados;
        const taxaAprovacao = (aprovados / registros.length) * 100;
        const medias = registros.map(r => r.mediaGeral);
        const mediaGeralTurma = medias.reduce((sum, media) => sum + media, 0) / medias.length;
        const presencas = registros.map(r => r.percentualPresenca);
        const presencaMediaTurma = presencas.reduce((sum, presenca) => sum + presenca, 0) / presencas.length;
        console.log('\n[RELATORIO] RELATÓRIO ESTATÍSTICO:');
        console.log('═'.repeat(50));
        console.log(`Total de alunos: ${registros.length}`);
        console.log(`Aprovados: ${aprovados} (${taxaAprovacao.toFixed(1)}%)`);
        console.log(`Reprovados: ${reprovados} (${(100 - taxaAprovacao).toFixed(1)}%)`);
        console.log(`Média geral da turma: ${mediaGeralTurma.toFixed(2)}`);
        console.log(`Presença média da turma: ${presencaMediaTurma.toFixed(1)}%`);
        console.log('═'.repeat(50));
    }
    exportarDados(nomeArquivo) {
        const registros = this.carregarAlunos();
        const diretorio = path.dirname(this.caminhoArquivo);
        const caminhoDestino = path.join(diretorio, nomeArquivo);
        const cabecalho = this.cabecalhoCSV.join(',');
        fs.writeFileSync(caminhoDestino, cabecalho + '\n', 'utf8');
        registros.forEach(registro => {
            const linha = this.converterRegistroParaLinha(registro);
            fs.appendFileSync(caminhoDestino, linha + '\n', 'utf8');
        });
        console.log(`[EXPORTAR] Dados exportados para: ${caminhoDestino}`);
    }
    inicializarArquivo() {
        if (!fs.existsSync(this.caminhoArquivo)) {
            const cabecalho = this.cabecalhoCSV.join(',');
            fs.writeFileSync(this.caminhoArquivo, cabecalho + '\n', 'utf8');
        }
    }
    converterAlunoParaCSV(aluno, resultado) {
        return {
            nome: aluno.nome,
            serie: aluno.serie,
            faltas: aluno.faltas,
            dataCadastro: aluno.dataCadastro.toISOString(),
            notasMatematica: aluno.notas[Aluno_1.Materia.MATEMATICA].join(';'),
            notasPortugues: aluno.notas[Aluno_1.Materia.PORTUGUES].join(';'),
            notasGeografia: aluno.notas[Aluno_1.Materia.GEOGRAFIA].join(';'),
            notasHistoria: aluno.notas[Aluno_1.Materia.HISTORIA].join(';'),
            notasQuimica: aluno.notas[Aluno_1.Materia.QUIMICA].join(';'),
            mediaGeral: resultado.mediaGeral,
            percentualPresenca: resultado.percentualPresenca,
            aprovado: resultado.aprovado,
            motivoReprovacao: resultado.motivoReprovacao
        };
    }
    converterRegistroParaLinha(registro) {
        const valores = [
            this.escaparValorCSV(registro.nome),
            this.escaparValorCSV(registro.serie),
            registro.faltas.toString(),
            registro.dataCadastro,
            this.escaparValorCSV(registro.notasMatematica),
            this.escaparValorCSV(registro.notasPortugues),
            this.escaparValorCSV(registro.notasGeografia),
            this.escaparValorCSV(registro.notasHistoria),
            this.escaparValorCSV(registro.notasQuimica),
            registro.mediaGeral.toString(),
            registro.percentualPresenca.toString(),
            registro.aprovado.toString(),
            this.escaparValorCSV(registro.motivoReprovacao || '')
        ];
        return valores.join(',');
    }
    converterLinhaParaRegistro(linha) {
        const valores = this.parsearLinhaCSV(linha);
        if (valores.length !== this.cabecalhoCSV.length) {
            throw new Error(`Linha CSV inválida: esperado ${this.cabecalhoCSV.length} campos, encontrado ${valores.length}`);
        }
        return {
            nome: valores[0],
            serie: valores[1],
            faltas: parseInt(valores[2]),
            dataCadastro: valores[3],
            notasMatematica: valores[4],
            notasPortugues: valores[5],
            notasGeografia: valores[6],
            notasHistoria: valores[7],
            notasQuimica: valores[8],
            mediaGeral: parseFloat(valores[9]),
            percentualPresenca: parseFloat(valores[10]),
            aprovado: valores[11] === 'true',
            motivoReprovacao: valores[12] || undefined
        };
    }
    escaparValorCSV(valor) {
        if (valor.includes(',') || valor.includes('"') || valor.includes('\n')) {
            return `"${valor.replace(/"/g, '""')}"`;
        }
        return valor;
    }
    parsearLinhaCSV(linha) {
        const valores = [];
        let valorAtual = '';
        let dentroAspas = false;
        for (let i = 0; i < linha.length; i++) {
            const char = linha[i];
            if (char === '"') {
                if (dentroAspas && linha[i + 1] === '"') {
                    valorAtual += '"';
                    i++;
                }
                else {
                    dentroAspas = !dentroAspas;
                }
            }
            else if (char === ',' && !dentroAspas) {
                valores.push(valorAtual);
                valorAtual = '';
            }
            else {
                valorAtual += char;
            }
        }
        valores.push(valorAtual);
        return valores;
    }
}
exports.CSVService = CSVService;
//# sourceMappingURL=CSVService.js.map