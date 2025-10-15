import { EncodingUtils } from './EncodingUtils';

/**
 * Utilitários para formatação de texto e saída no console
 */
export class FormatUtils {

  /**
   * Limpa a tela do console
   */
  static limparTela(): void {
    console.clear();
  }

  /**
   * Exibe um título formatado
   * @param titulo - Título a ser exibido
   */
  static exibirTitulo(titulo: string): void {
    const largura = Math.max(titulo.length + 4, 50);
    const linha = '═'.repeat(largura);
    const espacos = Math.floor((largura - titulo.length) / 2);
    
    console.log(linha);
    console.log(' '.repeat(espacos) + EncodingUtils.processarTexto(titulo));
    console.log(linha);
  }

  /**
   * Exibe uma seção formatada
   * @param titulo - Título da seção
   */
  static exibirSecao(titulo: string): void {
    const tituloProcessado = EncodingUtils.processarTexto(titulo);
    console.log(`\n${tituloProcessado}`);
    console.log('-'.repeat(tituloProcessado.length));
  }

  /**
   * Exibe uma mensagem de sucesso
   * @param mensagem - Mensagem a ser exibida
   */
  static exibirSucesso(mensagem: string): void {
    console.log(EncodingUtils.processarTexto(`[SUCESSO] ${mensagem}`));
  }

  /**
   * Exibe uma mensagem de erro
   * @param mensagem - Mensagem a ser exibida
   */
  static exibirErro(mensagem: string): void {
    console.log(EncodingUtils.processarTexto(`[ERRO] ${mensagem}`));
  }

  /**
   * Exibe uma mensagem de aviso
   * @param mensagem - Mensagem a ser exibida
   */
  static exibirAviso(mensagem: string): void {
    console.log(EncodingUtils.processarTexto(`[AVISO] ${mensagem}`));
  }

  /**
   * Exibe uma mensagem informativa
   * @param mensagem - Mensagem a ser exibida
   */
  static exibirInfo(mensagem: string): void {
    console.log(EncodingUtils.processarTexto(`[INFO] ${mensagem}`));
  }

  /**
   * Pausa a execução até o usuário pressionar uma tecla
   * @param mensagem - Mensagem a ser exibida (opcional)
   */
  static pausar(mensagem: string = 'Pressione qualquer tecla para continuar...'): void {
    const readlineSync = require('readline-sync');
    readlineSync.keyInPause(EncodingUtils.processarTexto(mensagem));
  }

  /**
   * Formata um número como porcentagem
   * @param valor - Valor numérico
   * @param decimais - Número de casas decimais
   * @returns String formatada
   */
  static formatarPorcentagem(valor: number, decimais: number = 1): string {
    return `${valor.toFixed(decimais)}%`;
  }

  /**
   * Formata uma nota com 2 casas decimais
   * @param nota - Valor da nota
   * @returns String formatada
   */
  static formatarNota(nota: number): string {
    return nota.toFixed(2);
  }
}