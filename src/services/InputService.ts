import * as readlineSync from 'readline-sync';
import { Aluno, Materia, NotasMateria } from '../models/Aluno';
import { CONFIG_AVALIACAO } from '../models/Constantes';

/**
 * Serviço responsável pela coleta de dados do aluno via interface de linha de comando
 */
export class InputService {

  /**
   * Coleta todos os dados necessários de um aluno
   * @returns Objeto Aluno com todos os dados preenchidos
   */
  public coletarDadosAluno(): Aluno {
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

  /**
   * Coleta e valida o nome do aluno
   * @returns Nome válido do aluno
   */
  private coletarNome(): string {
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

      // Validação básica de caracteres
      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
        console.log('[ERRO] O nome deve conter apenas letras e espaços. Tente novamente.');
        continue;
      }

      return nome;
    }
  }

  /**
   * Coleta e valida a série do aluno
   * @returns Série válida do aluno
   */
  private coletarSerie(): string {
    while (true) {
      const serie = readlineSync.question('Série do aluno (ex: 9º ano, 1º ano EM): ').trim();
      
      if (serie.length === 0) {
        console.log('[ERRO] A série não pode estar vazia. Tente novamente.');
        continue;
      }

      return serie;
    }
  }

  /**
   * Coleta e valida o número de faltas do aluno
   * @returns Número válido de faltas
   */
  private coletarFaltas(): number {
    while (true) {
      const faltasStr = readlineSync.question(`Número de faltas (máximo ${CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO}): `);
      const faltas = parseInt(faltasStr);
      
      if (isNaN(faltas)) {
        console.log('[ERRO] Por favor, insira um número válido para as faltas.');
        continue;
      }
      
      if (faltas < 0) {
        console.log('[ERRO] O número de faltas não pode ser negativo.');
        continue;
      }
      
      if (faltas > CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO) {
        console.log(`[ERRO] O número de faltas não pode exceder ${CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO}.`);
        continue;
      }

      return faltas;
    }
  }

  /**
   * Coleta todas as notas do aluno para todas as matérias
   * @returns Objeto com todas as notas organizadas por matéria
   */
  private coletarNotas(): NotasMateria {
    console.log(`\n[MATERIAS] Agora vamos inserir as ${CONFIG_AVALIACAO.NUMERO_NOTAS_POR_MATERIA} notas para cada matéria:`);
    
    const notas: NotasMateria = {
      [Materia.MATEMATICA]: [],
      [Materia.PORTUGUES]: [],
      [Materia.GEOGRAFIA]: [],
      [Materia.HISTORIA]: [],
      [Materia.QUIMICA]: []
    };

    const materias = Object.values(Materia);
    
    for (const materia of materias) {
      console.log(`\n--- ${materia} ---`);
      notas[materia] = this.coletarNotasMateria(materia);
    }

    return notas;
  }

  /**
   * Coleta as notas de uma matéria específica
   * @param materia - Matéria para a qual coletar as notas
   * @returns Array com as 8 notas da matéria
   */
  private coletarNotasMateria(materia: Materia): number[] {
    const notas: number[] = [];
    
    for (let i = 1; i <= CONFIG_AVALIACAO.NUMERO_NOTAS_POR_MATERIA; i++) {
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

  /**
   * Exibe uma confirmação dos dados coletados
   * @param aluno - Dados do aluno para confirmação
   * @returns true se o usuário confirmar, false caso contrário
   */
  public confirmarDados(aluno: Aluno): boolean {
    console.log('\n=== CONFIRMAÇÃO DOS DADOS ===');
    console.log(`Nome: ${aluno.nome}`);
    console.log(`Série: ${aluno.serie}`);
    console.log(`Faltas: ${aluno.faltas}`);
    console.log('\nNotas por matéria:');
    
    Object.entries(aluno.notas).forEach(([materia, notas]) => {
      const media = notas.reduce((sum: number, nota: number) => sum + nota, 0) / notas.length;
      console.log(`${materia}: [${notas.join(', ')}] - Média: ${media.toFixed(2)}`);
    });

    const confirmacao = readlineSync.keyInYNStrict('\nOs dados estão corretos?');
    return confirmacao;
  }
}