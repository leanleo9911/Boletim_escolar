import * as iconv from 'iconv-lite';

/**
 * Utilitários para configuração de encoding e caracteres especiais
 */
export class EncodingUtils {
  
  /**
   * Configura o console para suportar UTF-8 e caracteres acentuados
   */
  static configurarEncoding(): void {
    // Configurar encoding para UTF-8 no Windows
    if (process.platform === 'win32') {
      process.stdout.setEncoding('utf8');
      process.stderr.setEncoding('utf8');
      
      // Tentar configurar code page para UTF-8 no Windows
      try {
        const { execSync } = require('child_process');
        execSync('chcp 65001', { stdio: 'ignore' });
      } catch (error) {
        // Silenciosamente ignorar erro se não conseguir configurar
      }
    }
  }

  /**
   * Converte texto para exibição segura no console
   * @param texto - Texto a ser convertido
   * @returns Texto convertido para exibição
   */
  static converterParaConsole(texto: string): string {
    try {
      // Garantir que o texto está em UTF-8
      const buffer = iconv.encode(texto, 'utf8');
      return iconv.decode(buffer, 'utf8');
    } catch (error) {
      // Se falhar, retornar texto original
      return texto;
    }
  }

  /**
   * Substitui emojis por indicadores textuais
   * @param texto - Texto contendo emojis
   * @returns Texto com indicadores ao invés de emojis
   */
  static substituirEmojis(texto: string): string {
    const mapeamentoEmojis: { [key: string]: string } = {
      '🎓': '[EDUCACAO]',
      '📝': '[CADASTRO]',
      '📋': '[LISTA]',
      '📊': '[RELATORIO]',
      '📤': '[EXPORTAR]',
      '🚪': '[SAIR]',
      '✅': '[SUCESSO]',
      '❌': '[ERRO]',
      '⚠️': '[AVISO]',
      'ℹ️': '[INFO]',
      '🎉': '[APROVADO]',
      '🔧': '[SISTEMA]',
      '👋': '[TCHAU]',
      '💾': '[SALVAR]',
      '🧪': '[TESTE]',
      '📄': '[ARQUIVO]',
      '📁': '[PASTA]',
      '🎯': '[ALVO]',
      '💡': '[IDEIA]',
      '🚀': '[EXECUTAR]'
    };

    let textoLimpo = texto;
    
    // Substituir cada emoji por seu indicador textual
    Object.entries(mapeamentoEmojis).forEach(([emoji, indicador]) => {
      textoLimpo = textoLimpo.replace(new RegExp(emoji, 'g'), indicador);
    });

    return textoLimpo;
  }

  /**
   * Processa texto para exibição segura (remove emojis e configura encoding)
   * @param texto - Texto a ser processado
   * @returns Texto processado e seguro para exibição
   */
  static processarTexto(texto: string): string {
    const semEmojis = this.substituirEmojis(texto);
    return this.converterParaConsole(semEmojis);
  }

  /**
   * Inicializa as configurações de encoding para a aplicação
   */
  static inicializar(): void {
    this.configurarEncoding();
    
    console.log(this.processarTexto('🔧 Sistema de encoding configurado para suporte a acentos'));
    console.log('Caracteres especiais serao exibidos como indicadores textuais.');
  }
}