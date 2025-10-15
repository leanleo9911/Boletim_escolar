import { Aluno, Materia, ResultadoAvaliacao } from '../models/Aluno';
import { CONFIG_AVALIACAO } from '../models/Constantes';

/**
 * Serviço responsável pela avaliação e cálculos relacionados ao desempenho do aluno
 */
export class AvaliacaoService {

  /**
   * Avalia o desempenho completo de um aluno
   * @param aluno - Dados do aluno a ser avaliado
   * @returns Resultado completo da avaliação
   */
  public avaliarAluno(aluno: Aluno): ResultadoAvaliacao {
    const mediasPorMateria = this.calcularMediasPorMateria(aluno);
    const mediaGeral = this.calcularMediaGeral(mediasPorMateria);
    const percentualPresenca = this.calcularPercentualPresenca(aluno.faltas);
    
    const aprovadoPorNota = mediaGeral >= CONFIG_AVALIACAO.NOTA_MINIMA_APROVACAO;
    const aprovadoPorPresenca = percentualPresenca >= CONFIG_AVALIACAO.PRESENCA_MINIMA_APROVACAO;
    const aprovado = aprovadoPorNota && aprovadoPorPresenca;

    let motivoReprovacao: string | undefined;
    if (!aprovado) {
      const motivos: string[] = [];
      if (!aprovadoPorNota) {
        motivos.push(`média geral ${mediaGeral.toFixed(2)} inferior a ${CONFIG_AVALIACAO.NOTA_MINIMA_APROVACAO}`);
      }
      if (!aprovadoPorPresenca) {
        motivos.push(`presença ${percentualPresenca.toFixed(1)}% inferior a ${CONFIG_AVALIACAO.PRESENCA_MINIMA_APROVACAO}%`);
      }
      motivoReprovacao = motivos.join(' e ');
    }

    return {
      mediaGeral,
      percentualPresenca,
      aprovado,
      motivoReprovacao,
      mediasPorMateria
    };
  }

  /**
   * Calcula a média de cada matéria
   * @param aluno - Dados do aluno
   * @returns Objeto com as médias por matéria
   */
  private calcularMediasPorMateria(aluno: Aluno): Record<Materia, number> {
    const medias: Record<Materia, number> = {} as Record<Materia, number>;
    
    Object.entries(aluno.notas).forEach(([materia, notas]) => {
      const soma = notas.reduce((total: number, nota: number) => total + nota, 0);
      medias[materia as Materia] = soma / notas.length;
    });

    return medias;
  }

  /**
   * Calcula a média geral do aluno (média das médias das matérias)
   * @param mediasPorMateria - Médias de cada matéria
   * @returns Média geral do aluno
   */
  private calcularMediaGeral(mediasPorMateria: Record<Materia, number>): number {
    const medias = Object.values(mediasPorMateria);
    const somaMedias = medias.reduce((total: number, media: number) => total + media, 0);
    return somaMedias / medias.length;
  }

  /**
   * Calcula o percentual de presença do aluno
   * @param faltas - Número de faltas do aluno
   * @returns Percentual de presença
   */
  private calcularPercentualPresenca(faltas: number): number {
    const aulasPresentes = CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO - faltas;
    return (aulasPresentes / CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO) * 100;
  }

  /**
   * Verifica se o aluno está em recuperação em alguma matéria
   * @param mediasPorMateria - Médias por matéria
   * @returns Array com as matérias em recuperação
   */
  public obterMateriasEmRecuperacao(mediasPorMateria: Record<Materia, number>): Materia[] {
    const materiasRecuperacao: Materia[] = [];
    
    Object.entries(mediasPorMateria).forEach(([materia, media]) => {
      if (media < CONFIG_AVALIACAO.NOTA_MINIMA_APROVACAO) {
        materiasRecuperacao.push(materia as Materia);
      }
    });

    return materiasRecuperacao;
  }

  /**
   * Classifica o desempenho do aluno
   * @param mediaGeral - Média geral do aluno
   * @returns Classificação textual do desempenho
   */
  public classificarDesempenho(mediaGeral: number): string {
    if (mediaGeral >= 9.0) return 'Excelente';
    if (mediaGeral >= 8.0) return 'Bom';
    if (mediaGeral >= 7.0) return 'Regular';
    if (mediaGeral >= 5.0) return 'Insuficiente';
    return 'Crítico';
  }
}