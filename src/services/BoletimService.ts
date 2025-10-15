import * as fs from 'fs';
import * as path from 'path';
import { Boletim, Materia } from '../models/Aluno';
import { AvaliacaoService } from './AvaliacaoService';

/**
 * Serviço responsável pela geração de boletins em formato de texto
 */
export class BoletimService {
  private avaliacaoService: AvaliacaoService;

  constructor() {
    this.avaliacaoService = new AvaliacaoService();
  }

  /**
   * Gera um boletim completo em formato de texto
   * @param boletim - Dados do boletim a ser gerado
   * @returns Conteúdo do boletim em formato de texto
   */
  public gerarBoletimTexto(boletim: Boletim): string {
    const linhas: string[] = [];
    
    // Cabeçalho
    linhas.push('═'.repeat(80));
    linhas.push('                          BOLETIM ESCOLAR');
    linhas.push('═'.repeat(80));
    linhas.push('');

    // Informações do aluno
    linhas.push('DADOS DO ALUNO:');
    linhas.push('-'.repeat(40));
    linhas.push(`Nome: ${boletim.aluno.nome}`);
    linhas.push(`Série: ${boletim.aluno.serie}`);
    linhas.push(`Data de Cadastro: ${this.formatarData(boletim.aluno.dataCadastro)}`);
    linhas.push(`Data de Geração: ${this.formatarData(boletim.dataGeracao)}`);
    linhas.push('');

    // Frequência
    linhas.push('FREQUÊNCIA:');
    linhas.push('-'.repeat(40));
    linhas.push(`Faltas: ${boletim.aluno.faltas}`);
    linhas.push(`Presença: ${boletim.resultado.percentualPresenca.toFixed(1)}%`);
    linhas.push('');

    // Notas por matéria
    linhas.push('NOTAS POR MATÉRIA:');
    linhas.push('-'.repeat(40));
    linhas.push('Matéria'.padEnd(12) + 'Notas'.padEnd(45) + 'Média');
    linhas.push('-'.repeat(80));

    Object.entries(boletim.aluno.notas).forEach(([materia, notas]) => {
      const notasStr = notas.map((n: number) => n.toFixed(1)).join(', ');
      const media = boletim.resultado.mediasPorMateria[materia as Materia];
      
      linhas.push(
        materia.padEnd(12) + 
        `[${notasStr}]`.padEnd(45) + 
        media.toFixed(2)
      );
    });

    linhas.push('-'.repeat(80));
    linhas.push(`${'MÉDIA GERAL:'.padEnd(57)} ${boletim.resultado.mediaGeral.toFixed(2)}`);
    linhas.push('');

    // Matérias em recuperação
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

    // Classificação de desempenho
    const classificacao = this.avaliacaoService.classificarDesempenho(boletim.resultado.mediaGeral);
    linhas.push('DESEMPENHO:');
    linhas.push('-'.repeat(40));
    linhas.push(`Classificação: ${classificacao}`);
    linhas.push('');

    // Resultado final
    linhas.push('RESULTADO FINAL:');
    linhas.push('-'.repeat(40));
    if (boletim.resultado.aprovado) {
      linhas.push('[APROVADO] ALUNO APROVADO');
      linhas.push('');
      linhas.push('Parabéns! O aluno atingiu os critérios mínimos de aprovação:');
      linhas.push(`[CHECK] Média geral: ${boletim.resultado.mediaGeral.toFixed(2)} (>= 7.0)`);
      linhas.push(`[CHECK] Presença: ${boletim.resultado.percentualPresenca.toFixed(1)}% (>= 75%)`);
    } else {
      linhas.push('[REPROVADO] ALUNO REPROVADO');
      linhas.push('');
      linhas.push(`Motivo: ${boletim.resultado.motivoReprovacao}`);
      linhas.push('');
      linhas.push('Critérios de aprovação não atingidos:');
      if (boletim.resultado.mediaGeral < 7.0) {
        linhas.push(`[X] Média geral: ${boletim.resultado.mediaGeral.toFixed(2)} (< 7.0)`);
      } else {
        linhas.push(`[CHECK] Média geral: ${boletim.resultado.mediaGeral.toFixed(2)} (>= 7.0)`);
      }
      if (boletim.resultado.percentualPresenca < 75) {
        linhas.push(`[X] Presença: ${boletim.resultado.percentualPresenca.toFixed(1)}% (< 75%)`);
      } else {
        linhas.push(`[CHECK] Presença: ${boletim.resultado.percentualPresenca.toFixed(1)}% (>= 75%)`);
      }
    }

    linhas.push('');
    linhas.push('═'.repeat(80));
    linhas.push('              Sistema de Gestão de Boletins Escolares');
    linhas.push('═'.repeat(80));

    return linhas.join('\n');
  }

  /**
   * Salva um boletim em arquivo de texto
   * @param boletim - Dados do boletim
   * @param diretorio - Diretório onde salvar o arquivo (opcional)
   * @returns Caminho do arquivo gerado
   */
  public salvarBoletimArquivo(boletim: Boletim, diretorio: string = './data'): string {
    // Garantir que o diretório existe
    if (!fs.existsSync(diretorio)) {
      fs.mkdirSync(diretorio, { recursive: true });
    }

    // Gerar nome do arquivo
    const nomeArquivo = this.gerarNomeArquivo(boletim.aluno.nome, boletim.dataGeracao);
    const caminhoCompleto = path.join(diretorio, nomeArquivo);

    // Gerar conteúdo e salvar
    const conteudo = this.gerarBoletimTexto(boletim);
    fs.writeFileSync(caminhoCompleto, conteudo, 'utf8');

    return caminhoCompleto;
  }

  /**
   * Gera nome de arquivo baseado no nome do aluno e data
   * @param nomeAluno - Nome do aluno
   * @param data - Data de geração
   * @returns Nome do arquivo
   */
  private gerarNomeArquivo(nomeAluno: string, data: Date): string {
    const nomeFormatado = nomeAluno
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    const dataFormatada = data.toISOString().split('T')[0].replace(/-/g, '');
    const timestamp = data.getTime().toString().slice(-6);
    
    return `boletim_${nomeFormatado}_${dataFormatada}_${timestamp}.txt`;
  }

  /**
   * Formata uma data para exibição
   * @param data - Data a ser formatada
   * @returns Data formatada em string
   */
  private formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}