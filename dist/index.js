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
exports.SistemaBoletim = void 0;
const readlineSync = __importStar(require("readline-sync"));
const InputService_1 = require("./services/InputService");
const AvaliacaoService_1 = require("./services/AvaliacaoService");
const BoletimService_1 = require("./services/BoletimService");
const CSVService_1 = require("./services/CSVService");
const FormatUtils_1 = require("./utils/FormatUtils");
const EncodingUtils_1 = require("./utils/EncodingUtils");
class SistemaBoletim {
    constructor() {
        this.inputService = new InputService_1.InputService();
        this.avaliacaoService = new AvaliacaoService_1.AvaliacaoService();
        this.boletimService = new BoletimService_1.BoletimService();
        this.csvService = new CSVService_1.CSVService();
    }
    iniciar() {
        EncodingUtils_1.EncodingUtils.inicializar();
        FormatUtils_1.FormatUtils.limparTela();
        FormatUtils_1.FormatUtils.exibirTitulo('SISTEMA DE GESTÃO DE BOLETINS ESCOLARES');
        console.log('\n[EDUCACAO] Bem-vindo ao Sistema de Gestão de Boletins Escolares!');
        console.log('\nEste sistema permite:');
        console.log('• Cadastrar alunos com suas notas e frequência');
        console.log('• Calcular médias e determinar aprovação/reprovação');
        console.log('• Gerar boletins em formato texto');
        console.log('• Armazenar dados em arquivo CSV');
        console.log('• Consultar histórico e estatísticas');
        this.exibirMenuPrincipal();
    }
    exibirMenuPrincipal() {
        while (true) {
            try {
                FormatUtils_1.FormatUtils.exibirSecao('\nMENU PRINCIPAL');
                const opcoes = [
                    '[CADASTRO] Cadastrar novo aluno',
                    '[LISTA] Listar alunos cadastrados',
                    '[RELATORIO] Gerar relatório estatístico',
                    '[EXPORTAR] Exportar dados para CSV',
                    '[SAIR] Sair do sistema'
                ];
                const escolha = readlineSync.keyInSelect(opcoes, 'Escolha uma opção:', { cancel: false });
                switch (escolha) {
                    case 0:
                        this.cadastrarAluno();
                        break;
                    case 1:
                        this.listarAlunos();
                        break;
                    case 2:
                        this.gerarRelatorio();
                        break;
                    case 3:
                        this.exportarDados();
                        break;
                    case 4:
                        this.sairSistema();
                        return;
                }
            }
            catch (error) {
                FormatUtils_1.FormatUtils.exibirErro(`Erro inesperado: ${error}`);
                FormatUtils_1.FormatUtils.pausar();
            }
        }
    }
    cadastrarAluno() {
        FormatUtils_1.FormatUtils.limparTela();
        FormatUtils_1.FormatUtils.exibirTitulo('CADASTRO DE NOVO ALUNO');
        try {
            const aluno = this.inputService.coletarDadosAluno();
            if (!this.inputService.confirmarDados(aluno)) {
                FormatUtils_1.FormatUtils.exibirAviso('Cadastro cancelado pelo usuário.');
                FormatUtils_1.FormatUtils.pausar();
                return;
            }
            const resultado = this.avaliacaoService.avaliarAluno(aluno);
            const boletim = {
                aluno,
                resultado,
                dataGeracao: new Date()
            };
            this.exibirResultadoAvaliacao(boletim);
            this.salvarDadosAluno(boletim);
            FormatUtils_1.FormatUtils.exibirSucesso('Aluno cadastrado com sucesso!');
        }
        catch (error) {
            FormatUtils_1.FormatUtils.exibirErro(`Erro durante o cadastro: ${error}`);
        }
        FormatUtils_1.FormatUtils.pausar();
    }
    exibirResultadoAvaliacao(boletim) {
        FormatUtils_1.FormatUtils.exibirSecao('RESULTADO DA AVALIAÇÃO');
        console.log(`Aluno: ${boletim.aluno.nome}`);
        console.log(`Série: ${boletim.aluno.serie}`);
        console.log(`Média Geral: ${FormatUtils_1.FormatUtils.formatarNota(boletim.resultado.mediaGeral)}`);
        console.log(`Presença: ${FormatUtils_1.FormatUtils.formatarPorcentagem(boletim.resultado.percentualPresenca)}`);
        const classificacao = this.avaliacaoService.classificarDesempenho(boletim.resultado.mediaGeral);
        console.log(`Desempenho: ${classificacao}`);
        if (boletim.resultado.aprovado) {
            FormatUtils_1.FormatUtils.exibirSucesso('ALUNO APROVADO!');
        }
        else {
            FormatUtils_1.FormatUtils.exibirErro(`ALUNO REPROVADO - ${boletim.resultado.motivoReprovacao}`);
        }
        const materiasRecuperacao = this.avaliacaoService.obterMateriasEmRecuperacao(boletim.resultado.mediasPorMateria);
        if (materiasRecuperacao.length > 0) {
            FormatUtils_1.FormatUtils.exibirAviso(`Matérias em recuperação: ${materiasRecuperacao.join(', ')}`);
        }
    }
    salvarDadosAluno(boletim) {
        try {
            this.csvService.salvarAluno(boletim.aluno, boletim.resultado);
            const caminhoBoletim = this.boletimService.salvarBoletimArquivo(boletim);
            FormatUtils_1.FormatUtils.exibirSucesso(`Boletim salvo em: ${caminhoBoletim}`);
        }
        catch (error) {
            FormatUtils_1.FormatUtils.exibirErro(`Erro ao salvar dados: ${error}`);
        }
    }
    listarAlunos() {
        FormatUtils_1.FormatUtils.limparTela();
        FormatUtils_1.FormatUtils.exibirTitulo('ALUNOS CADASTRADOS');
        try {
            this.csvService.listarAlunos();
        }
        catch (error) {
            FormatUtils_1.FormatUtils.exibirErro(`Erro ao listar alunos: ${error}`);
        }
        FormatUtils_1.FormatUtils.pausar();
    }
    gerarRelatorio() {
        FormatUtils_1.FormatUtils.limparTela();
        FormatUtils_1.FormatUtils.exibirTitulo('RELATÓRIO ESTATÍSTICO');
        try {
            this.csvService.gerarRelatorio();
        }
        catch (error) {
            FormatUtils_1.FormatUtils.exibirErro(`Erro ao gerar relatório: ${error}`);
        }
        FormatUtils_1.FormatUtils.pausar();
    }
    exportarDados() {
        FormatUtils_1.FormatUtils.limparTela();
        FormatUtils_1.FormatUtils.exibirTitulo('EXPORTAR DADOS');
        try {
            const nomeArquivo = readlineSync.question('Nome do arquivo de destino (ex: backup_alunos.csv): ');
            if (!nomeArquivo.trim()) {
                FormatUtils_1.FormatUtils.exibirAviso('Nome de arquivo inválido.');
                FormatUtils_1.FormatUtils.pausar();
                return;
            }
            const nomeCompleto = nomeArquivo.endsWith('.csv') ? nomeArquivo : `${nomeArquivo}.csv`;
            this.csvService.exportarDados(nomeCompleto);
            FormatUtils_1.FormatUtils.exibirSucesso('Dados exportados com sucesso!');
        }
        catch (error) {
            FormatUtils_1.FormatUtils.exibirErro(`Erro ao exportar dados: ${error}`);
        }
        FormatUtils_1.FormatUtils.pausar();
    }
    sairSistema() {
        FormatUtils_1.FormatUtils.limparTela();
        FormatUtils_1.FormatUtils.exibirTitulo('ENCERRANDO SISTEMA');
        console.log('\n[EDUCACAO] Obrigado por usar o Sistema de Gestão de Boletins Escolares!');
        console.log('\nSeus dados foram salvos com segurança.');
        console.log('Até a próxima!\n');
    }
}
exports.SistemaBoletim = SistemaBoletim;
function main() {
    try {
        const sistema = new SistemaBoletim();
        sistema.iniciar();
    }
    catch (error) {
        console.error('[ERRO] Erro crítico na aplicação:', error);
        console.log('\n[SISTEMA] Verifique se todas as dependências estão instaladas e tente novamente.');
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=index.js.map