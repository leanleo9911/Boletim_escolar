"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatUtils = void 0;
const EncodingUtils_1 = require("./EncodingUtils");
class FormatUtils {
    static limparTela() {
        console.clear();
    }
    static exibirTitulo(titulo) {
        const largura = Math.max(titulo.length + 4, 50);
        const linha = '═'.repeat(largura);
        const espacos = Math.floor((largura - titulo.length) / 2);
        console.log(linha);
        console.log(' '.repeat(espacos) + EncodingUtils_1.EncodingUtils.processarTexto(titulo));
        console.log(linha);
    }
    static exibirSecao(titulo) {
        const tituloProcessado = EncodingUtils_1.EncodingUtils.processarTexto(titulo);
        console.log(`\n${tituloProcessado}`);
        console.log('-'.repeat(tituloProcessado.length));
    }
    static exibirSucesso(mensagem) {
        console.log(EncodingUtils_1.EncodingUtils.processarTexto(`[SUCESSO] ${mensagem}`));
    }
    static exibirErro(mensagem) {
        console.log(EncodingUtils_1.EncodingUtils.processarTexto(`[ERRO] ${mensagem}`));
    }
    static exibirAviso(mensagem) {
        console.log(EncodingUtils_1.EncodingUtils.processarTexto(`[AVISO] ${mensagem}`));
    }
    static exibirInfo(mensagem) {
        console.log(EncodingUtils_1.EncodingUtils.processarTexto(`[INFO] ${mensagem}`));
    }
    static pausar(mensagem = 'Pressione qualquer tecla para continuar...') {
        const readlineSync = require('readline-sync');
        readlineSync.keyInPause(EncodingUtils_1.EncodingUtils.processarTexto(mensagem));
    }
    static formatarPorcentagem(valor, decimais = 1) {
        return `${valor.toFixed(decimais)}%`;
    }
    static formatarNota(nota) {
        return nota.toFixed(2);
    }
}
exports.FormatUtils = FormatUtils;
//# sourceMappingURL=FormatUtils.js.map