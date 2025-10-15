/**
 * Enumeração das matérias escolares disponíveis
 */
export enum Materia {
  MATEMATICA = 'Matemática',
  PORTUGUES = 'Português',
  GEOGRAFIA = 'Geografia',
  HISTORIA = 'História',
  QUIMICA = 'Química'
}

/**
 * Interface que representa as notas de um aluno por matéria
 * Cada matéria deve ter exatamente 8 notas
 */
export interface NotasMateria {
  [Materia.MATEMATICA]: number[];
  [Materia.PORTUGUES]: number[];
  [Materia.GEOGRAFIA]: number[];
  [Materia.HISTORIA]: number[];
  [Materia.QUIMICA]: number[];
}

/**
 * Interface que representa um aluno
 */
export interface Aluno {
  /** Nome completo do aluno */
  nome: string;
  /** Série que o aluno está cursando */
  serie: string;
  /** Número de faltas do aluno no período */
  faltas: number;
  /** Notas do aluno organizadas por matéria */
  notas: NotasMateria;
  /** Data de cadastro do aluno */
  dataCadastro: Date;
}

/**
 * Interface que representa o resultado da avaliação de um aluno
 */
export interface ResultadoAvaliacao {
  /** Média geral do aluno */
  mediaGeral: number;
  /** Percentual de presença do aluno */
  percentualPresenca: number;
  /** Indica se o aluno foi aprovado */
  aprovado: boolean;
  /** Motivo da reprovação (se aplicável) */
  motivoReprovacao?: string;
  /** Médias por matéria */
  mediasPorMateria: Record<Materia, number>;
}

/**
 * Interface que representa um boletim completo
 */
export interface Boletim {
  /** Dados do aluno */
  aluno: Aluno;
  /** Resultado da avaliação */
  resultado: ResultadoAvaliacao;
  /** Data de geração do boletim */
  dataGeracao: Date;
}