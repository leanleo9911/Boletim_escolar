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
exports.BoletimService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const AvaliacaoService_1 = require("./AvaliacaoService");
class BoletimService {
    constructor() {
        this.avaliacaoService = new AvaliacaoService_1.AvaliacaoService();
    }
    gerarBoletimTexto(boletim) {
        const linhas = [];
        linhas.push('═'.repeat(80));
        linhas.push('                          BOLETIM ESCOLAR');
        linhas.push('═'.repeat(80));
        linhas.push('');
        linhas.push('DADOS DO ALUNO:');
        linhas.push('-'.repeat(40));
        linhas.push(`Nome: ${boletim.aluno.nome}`);
        linhas.push(`Série: ${boletim.aluno.serie}`);
        linhas.push(`Data de Cadastro: ${this.formatarData(boletim.aluno.dataCadastro)}`);
        linhas.push(`Data de Geração: ${this.formatarData(boletim.dataGeracao)}`);
        linhas.push('');
        linhas.push('FREQUÊNCIA:');
        linhas.push('-'.repeat(40));
        linhas.push(`Faltas: ${boletim.aluno.faltas}`);
        linhas.push(`Presença: ${boletim.resultado.percentualPresenca.toFixed(1)}%`);
        linhas.push('');
        linhas.push('NOTAS POR MATÉRIA:');
        linhas.push('-'.repeat(40));
        linhas.push('Matéria'.padEnd(12) + 'Notas'.padEnd(45) + 'Média');
        linhas.push('-'.repeat(80));
        Object.entries(boletim.aluno.notas).forEach(([materia, notas]) => {
            const notasStr = notas.map((n) => n.toFixed(1)).join(', ');
            const media = boletim.resultado.mediasPorMateria[materia];
            linhas.push(materia.padEnd(12) +
                `[${notasStr}]`.padEnd(45) +
                media.toFixed(2));
        });
        linhas.push('-'.repeat(80));
        linhas.push(`${'MÉDIA GERAL:'.padEnd(57)} ${boletim.resultado.mediaGeral.toFixed(2)}`);
        linhas.push('');
        const materiasRecuperacao = this.avaliacaoService.obterMateriasEmRecuperacao(boletim.resultado.mediasPorMateria);
        if (materiasRecuperacao.length > 0) {
            linhas.push('MATÉRIAS EM RECUPERAÇÃO:');
            linhas.push('-'.repeat(40));
            materiasRecuperacao.forEach(materia => {
                const media = boletim.resultado.mediasPorMateria[materia];
                linhas.push(`• ${materia} (Média: ${media.toFixed(2)})`);
            });
            linhas.push('');
        }
        const classificacao = this.avaliacaoService.classificarDesempenho(boletim.resultado.mediaGeral);
        linhas.push('DESEMPENHO:');
        linhas.push('-'.repeat(40));
        linhas.push(`Classificação: ${classificacao}`);
        linhas.push('');
        linhas.push('RESULTADO FINAL:');
        linhas.push('-'.repeat(40));
        if (boletim.resultado.aprovado) {
            linhas.push('[APROVADO] ALUNO APROVADO');
            linhas.push('');
            linhas.push('Parabéns! O aluno atingiu os critérios mínimos de aprovação:');
            linhas.push(`[CHECK] Média geral: ${boletim.resultado.mediaGeral.toFixed(2)} (>= 7.0)`);
            linhas.push(`[CHECK] Presença: ${boletim.resultado.percentualPresenca.toFixed(1)}% (>= 75%)`);
        }
        else {
            linhas.push('[REPROVADO] ALUNO REPROVADO');
            linhas.push('');
            linhas.push(`Motivo: ${boletim.resultado.motivoReprovacao}`);
            linhas.push('');
            linhas.push('Critérios de aprovação não atingidos:');
            if (boletim.resultado.mediaGeral < 7.0) {
                linhas.push(`[X] Média geral: ${boletim.resultado.mediaGeral.toFixed(2)} (< 7.0)`);
            }
            else {
                linhas.push(`[CHECK] Média geral: ${boletim.resultado.mediaGeral.toFixed(2)} (>= 7.0)`);
            }
            if (boletim.resultado.percentualPresenca < 75) {
                linhas.push(`[X] Presença: ${boletim.resultado.percentualPresenca.toFixed(1)}% (< 75%)`);
            }
            else {
                linhas.push(`[CHECK] Presença: ${boletim.resultado.percentualPresenca.toFixed(1)}% (>= 75%)`);
            }
        }
        linhas.push('');
        linhas.push('═'.repeat(80));
        linhas.push('              Sistema de Gestão de Boletins Escolares');
        linhas.push('═'.repeat(80));
        return linhas.join('\n');
    }
    salvarBoletimArquivo(boletim, diretorio = './data') {
        if (!fs.existsSync(diretorio)) {
            fs.mkdirSync(diretorio, { recursive: true });
        }
        const nomeArquivo = this.gerarNomeArquivo(boletim.aluno.nome, boletim.dataGeracao);
        const caminhoCompleto = path.join(diretorio, nomeArquivo);
        const conteudo = this.gerarBoletimTexto(boletim);
        fs.writeFileSync(caminhoCompleto, conteudo, 'utf8');
        return caminhoCompleto;
    }
    gerarNomeArquivo(nomeAluno, data) {
        const nomeFormatado = nomeAluno
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        const dataFormatada = data.toISOString().split('T')[0].replace(/-/g, '');
        const timestamp = data.getTime().toString().slice(-6);
        return `boletim_${nomeFormatado}_${dataFormatada}_${timestamp}.txt`;
    }
    formatarData(data) {
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
exports.BoletimService = BoletimService;
//# sourceMappingURL=BoletimService.js.map