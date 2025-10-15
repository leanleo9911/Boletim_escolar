import * as readlineSync from 'readline-sync';
import { Aluno, Boletim } from './models/Aluno';
import { InputService } from './services/InputService';
import { AvaliacaoService } from './services/AvaliacaoService';
import { BoletimService } from './services/BoletimService';
import { CSVService } from './services/CSVService';
import { FormatUtils } from './utils/FormatUtils';
import { EncodingUtils } from './utils/EncodingUtils';

/**
 * Classe principal do sistema de gestão de boletins escolares
 */
class SistemaBoletim {
  private inputService: InputService;
  private avaliacaoService: AvaliacaoService;
  private boletimService: BoletimService;
  private csvService: CSVService;

  constructor() {
    this.inputService = new InputService();
    this.avaliacaoService = new AvaliacaoService();
    this.boletimService = new BoletimService();
    this.csvService = new CSVService();
  }

  /**
   * Inicia o sistema e exibe o menu principal
   */
  public iniciar(): void {
    // Configurar encoding para suporte a acentos
    EncodingUtils.inicializar();
    
    FormatUtils.limparTela();
    FormatUtils.exibirTitulo('SISTEMA DE GESTÃO DE BOLETINS ESCOLARES');
    
    console.log('\n[EDUCACAO] Bem-vindo ao Sistema de Gestão de Boletins Escolares!');
    console.log('\nEste sistema permite:');
    console.log('• Cadastrar alunos com suas notas e frequência');
    console.log('• Calcular médias e determinar aprovação/reprovação');
    console.log('• Gerar boletins em formato texto');
    console.log('• Armazenar dados em arquivo CSV');
    console.log('• Consultar histórico e estatísticas');

    this.exibirMenuPrincipal();
  }

  /**
   * Exibe o menu principal e processa as opções
   */
  private exibirMenuPrincipal(): void {
    while (true) {
      try {
        FormatUtils.exibirSecao('\nMENU PRINCIPAL');
        
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
      } catch (error) {
        FormatUtils.exibirErro(`Erro inesperado: ${error}`);
        FormatUtils.pausar();
      }
    }
  }

  /**
   * Processa o cadastro de um novo aluno
   */
  private cadastrarAluno(): void {
    FormatUtils.limparTela();
    FormatUtils.exibirTitulo('CADASTRO DE NOVO ALUNO');

    try {
      // Coletar dados do aluno
      const aluno = this.inputService.coletarDadosAluno();
      
      // Confirmar dados com o usuário
      if (!this.inputService.confirmarDados(aluno)) {
        FormatUtils.exibirAviso('Cadastro cancelado pelo usuário.');
        FormatUtils.pausar();
        return;
      }

      // Avaliar aluno
      const resultado = this.avaliacaoService.avaliarAluno(aluno);
      
      // Criar boletim
      const boletim: Boletim = {
        aluno,
        resultado,
        dataGeracao: new Date()
      };

      // Exibir resultado
      this.exibirResultadoAvaliacao(boletim);
      
      // Salvar dados
      this.salvarDadosAluno(boletim);
      
      FormatUtils.exibirSucesso('Aluno cadastrado com sucesso!');
      
    } catch (error) {
      FormatUtils.exibirErro(`Erro durante o cadastro: ${error}`);
    }

    FormatUtils.pausar();
  }

  /**
   * Exibe o resultado da avaliação de um aluno
   */
  private exibirResultadoAvaliacao(boletim: Boletim): void {
    FormatUtils.exibirSecao('RESULTADO DA AVALIAÇÃO');
    
    console.log(`Aluno: ${boletim.aluno.nome}`);
    console.log(`Série: ${boletim.aluno.serie}`);
    console.log(`Média Geral: ${FormatUtils.formatarNota(boletim.resultado.mediaGeral)}`);
    console.log(`Presença: ${FormatUtils.formatarPorcentagem(boletim.resultado.percentualPresenca)}`);
    
    const classificacao = this.avaliacaoService.classificarDesempenho(boletim.resultado.mediaGeral);
    console.log(`Desempenho: ${classificacao}`);

    // Status de aprovação
    if (boletim.resultado.aprovado) {
      FormatUtils.exibirSucesso('ALUNO APROVADO!');
    } else {
      FormatUtils.exibirErro(`ALUNO REPROVADO - ${boletim.resultado.motivoReprovacao}`);
    }

    // Matérias em recuperação
    const materiasRecuperacao = this.avaliacaoService.obterMateriasEmRecuperacao(boletim.resultado.mediasPorMateria);
    if (materiasRecuperacao.length > 0) {
      FormatUtils.exibirAviso(`Matérias em recuperação: ${materiasRecuperacao.join(', ')}`);
    }
  }

  /**
   * Salva os dados do aluno no CSV e gera boletim
   */
  private salvarDadosAluno(boletim: Boletim): void {
    try {
      // Salvar no CSV
      this.csvService.salvarAluno(boletim.aluno, boletim.resultado);
      
      // Gerar boletim em arquivo
      const caminhoBoletim = this.boletimService.salvarBoletimArquivo(boletim);
      FormatUtils.exibirSucesso(`Boletim salvo em: ${caminhoBoletim}`);
      
    } catch (error) {
      FormatUtils.exibirErro(`Erro ao salvar dados: ${error}`);
    }
  }

  /**
   * Lista todos os alunos cadastrados
   */
  private listarAlunos(): void {
    FormatUtils.limparTela();
    FormatUtils.exibirTitulo('ALUNOS CADASTRADOS');

    try {
      this.csvService.listarAlunos();
    } catch (error) {
      FormatUtils.exibirErro(`Erro ao listar alunos: ${error}`);
    }

    FormatUtils.pausar();
  }

  /**
   * Gera relatório estatístico da turma
   */
  private gerarRelatorio(): void {
    FormatUtils.limparTela();
    FormatUtils.exibirTitulo('RELATÓRIO ESTATÍSTICO');

    try {
      this.csvService.gerarRelatorio();
    } catch (error) {
      FormatUtils.exibirErro(`Erro ao gerar relatório: ${error}`);
    }

    FormatUtils.pausar();
  }

  /**
   * Exporta dados para arquivo CSV
   */
  private exportarDados(): void {
    FormatUtils.limparTela();
    FormatUtils.exibirTitulo('EXPORTAR DADOS');

    try {
      const nomeArquivo = readlineSync.question('Nome do arquivo de destino (ex: backup_alunos.csv): ');
      
      if (!nomeArquivo.trim()) {
        FormatUtils.exibirAviso('Nome de arquivo inválido.');
        FormatUtils.pausar();
        return;
      }

      const nomeCompleto = nomeArquivo.endsWith('.csv') ? nomeArquivo : `${nomeArquivo}.csv`;
      this.csvService.exportarDados(nomeCompleto);
      
      FormatUtils.exibirSucesso('Dados exportados com sucesso!');
      
    } catch (error) {
      FormatUtils.exibirErro(`Erro ao exportar dados: ${error}`);
    }

    FormatUtils.pausar();
  }

  /**
   * Encerra o sistema
   */
  private sairSistema(): void {
    FormatUtils.limparTela();
    FormatUtils.exibirTitulo('ENCERRANDO SISTEMA');
    
    console.log('\n[EDUCACAO] Obrigado por usar o Sistema de Gestão de Boletins Escolares!');
    console.log('\nSeus dados foram salvos com segurança.');
    console.log('Até a próxima!\n');
  }
}

/**
 * Função principal da aplicação
 */
function main(): void {
  try {
    const sistema = new SistemaBoletim();
    sistema.iniciar();
  } catch (error) {
    console.error('[ERRO] Erro crítico na aplicação:', error);
    console.log('\n[SISTEMA] Verifique se todas as dependências estão instaladas e tente novamente.');
    process.exit(1);
  }
}

// Executar aplicação se este arquivo for chamado diretamente
if (require.main === module) {
  main();
}

export { SistemaBoletim };