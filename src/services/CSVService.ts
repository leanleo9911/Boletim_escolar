import * as fs from 'fs';
import * as path from 'path';
import { Aluno, Materia, ResultadoAvaliacao } from '../models/Aluno';

/**
 * Interface para representar um registro de aluno no CSV
 */
interface RegistroAlunoCSV {
  nome: string;
  serie: string;
  faltas: number;
  dataCadastro: string;
  // Notas das matérias (8 notas cada)
  notasMatematica: string;
  notasPortugues: string;
  notasGeografia: string;
  notasHistoria: string;
  notasQuimica: string;
  // Resultados da avaliação
  mediaGeral: number;
  percentualPresenca: number;
  aprovado: boolean;
  motivoReprovacao?: string;
}

/**
 * Serviço responsável pela persistência de dados em formato CSV
 */
export class CSVService {
  private readonly caminhoArquivo: string;
  private readonly cabecalhoCSV: string[];

  constructor(diretorio: string = './data', nomeArquivo: string = 'alunos.csv') {
    // Garantir que o diretório existe
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

  /**
   * Salva um aluno e seu resultado de avaliação no arquivo CSV
   * @param aluno - Dados do aluno
   * @param resultado - Resultado da avaliação do aluno
   */
  public salvarAluno(aluno: Aluno, resultado: ResultadoAvaliacao): void {
    const registro = this.converterAlunoParaCSV(aluno, resultado);
    const linha = this.converterRegistroParaLinha(registro);
    
    // Adicionar a linha ao arquivo
    fs.appendFileSync(this.caminhoArquivo, linha + '\n', 'utf8');
    
    console.log(`[SUCESSO] Dados do aluno "${aluno.nome}" salvos no arquivo CSV.`);
  }

  /**
   * Carrega todos os alunos do arquivo CSV
   * @returns Array com todos os registros de alunos
   */
  public carregarAlunos(): RegistroAlunoCSV[] {
    if (!fs.existsSync(this.caminhoArquivo)) {
      return [];
    }

    const conteudo = fs.readFileSync(this.caminhoArquivo, 'utf8');
    const linhas = conteudo.trim().split('\n');
    
    // Remover o cabeçalho
    if (linhas.length <= 1) {
      return [];
    }

    const registros: RegistroAlunoCSV[] = [];
    
    for (let i = 1; i < linhas.length; i++) {
      try {
        const registro = this.converterLinhaParaRegistro(linhas[i]);
        registros.push(registro);
      } catch (error) {
        console.warn(`[AVISO] Erro ao processar linha ${i + 1} do CSV: ${error}`);
      }
    }

    return registros;
  }

  /**
   * Lista todos os alunos salvos em formato resumido
   */
  public listarAlunos(): void {
    const registros = this.carregarAlunos();
    
    if (registros.length === 0) {
      console.log('[INFO] Nenhum aluno encontrado no arquivo.');
      return;
    }

    console.log(`\n[LISTA] ALUNOS CADASTRADOS (${registros.length} total):`);
    console.log('-'.repeat(80));
    console.log('Nome'.padEnd(25) + 'Série'.padEnd(15) + 'Média'.padEnd(10) + 'Presença'.padEnd(12) + 'Status');
    console.log('-'.repeat(80));

    registros.forEach((registro: RegistroAlunoCSV) => {
      const status = registro.aprovado ? '[APROVADO] Aprovado' : '[REPROVADO] Reprovado';
      console.log(
        registro.nome.padEnd(25) +
        registro.serie.padEnd(15) +
        registro.mediaGeral.toFixed(2).padEnd(10) +
        `${registro.percentualPresenca.toFixed(1)}%`.padEnd(12) +
        status
      );
    });
    console.log('-'.repeat(80));
  }

  /**
   * Gera relatório estatístico dos alunos
   */
  public gerarRelatorio(): void {
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

  /**
   * Exporta dados para um novo arquivo CSV com nome personalizado
   * @param nomeArquivo - Nome do arquivo de destino
   */
  public exportarDados(nomeArquivo: string): void {
    const registros = this.carregarAlunos();
    const diretorio = path.dirname(this.caminhoArquivo);
    const caminhoDestino = path.join(diretorio, nomeArquivo);
    
    // Criar arquivo com cabeçalho
    const cabecalho = this.cabecalhoCSV.join(',');
    fs.writeFileSync(caminhoDestino, cabecalho + '\n', 'utf8');
    
    // Adicionar todos os registros
    registros.forEach(registro => {
      const linha = this.converterRegistroParaLinha(registro);
      fs.appendFileSync(caminhoDestino, linha + '\n', 'utf8');
    });
    
    console.log(`[EXPORTAR] Dados exportados para: ${caminhoDestino}`);
  }

  /**
   * Inicializa o arquivo CSV com o cabeçalho, se não existir
   */
  private inicializarArquivo(): void {
    if (!fs.existsSync(this.caminhoArquivo)) {
      const cabecalho = this.cabecalhoCSV.join(',');
      fs.writeFileSync(this.caminhoArquivo, cabecalho + '\n', 'utf8');
    }
  }

  /**
   * Converte um aluno e resultado para registro CSV
   * @param aluno - Dados do aluno
   * @param resultado - Resultado da avaliação
   * @returns Registro no formato CSV
   */
  private converterAlunoParaCSV(aluno: Aluno, resultado: ResultadoAvaliacao): RegistroAlunoCSV {
    return {
      nome: aluno.nome,
      serie: aluno.serie,
      faltas: aluno.faltas,
      dataCadastro: aluno.dataCadastro.toISOString(),
      notasMatematica: aluno.notas[Materia.MATEMATICA].join(';'),
      notasPortugues: aluno.notas[Materia.PORTUGUES].join(';'),
      notasGeografia: aluno.notas[Materia.GEOGRAFIA].join(';'),
      notasHistoria: aluno.notas[Materia.HISTORIA].join(';'),
      notasQuimica: aluno.notas[Materia.QUIMICA].join(';'),
      mediaGeral: resultado.mediaGeral,
      percentualPresenca: resultado.percentualPresenca,
      aprovado: resultado.aprovado,
      motivoReprovacao: resultado.motivoReprovacao
    };
  }

  /**
   * Converte um registro em linha CSV
   * @param registro - Registro a ser convertido
   * @returns Linha CSV
   */
  private converterRegistroParaLinha(registro: RegistroAlunoCSV): string {
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

  /**
   * Converte uma linha CSV em registro
   * @param linha - Linha CSV
   * @returns Registro do aluno
   */
  private converterLinhaParaRegistro(linha: string): RegistroAlunoCSV {
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

  /**
   * Escapa valores para CSV (adiciona aspas se necessário)
   * @param valor - Valor a ser escapado
   * @returns Valor escapado
   */
  private escaparValorCSV(valor: string): string {
    if (valor.includes(',') || valor.includes('"') || valor.includes('\n')) {
      return `"${valor.replace(/"/g, '""')}"`;
    }
    return valor;
  }

  /**
   * Faz o parse de uma linha CSV considerando aspas
   * @param linha - Linha CSV
   * @returns Array de valores
   */
  private parsearLinhaCSV(linha: string): string[] {
    const valores: string[] = [];
    let valorAtual = '';
    let dentroAspas = false;
    
    for (let i = 0; i < linha.length; i++) {
      const char = linha[i];
      
      if (char === '"') {
        if (dentroAspas && linha[i + 1] === '"') {
          valorAtual += '"';
          i++; // Pular a próxima aspa
        } else {
          dentroAspas = !dentroAspas;
        }
      } else if (char === ',' && !dentroAspas) {
        valores.push(valorAtual);
        valorAtual = '';
      } else {
        valorAtual += char;
      }
    }
    
    valores.push(valorAtual);
    return valores;
  }
}