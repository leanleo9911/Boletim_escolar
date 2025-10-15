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
exports.EncodingUtils = void 0;
const iconv = __importStar(require("iconv-lite"));
class EncodingUtils {
    static configurarEncoding() {
        if (process.platform === 'win32') {
            process.stdout.setEncoding('utf8');
            process.stderr.setEncoding('utf8');
            try {
                const { execSync } = require('child_process');
                execSync('chcp 65001', { stdio: 'ignore' });
            }
            catch (error) {
            }
        }
    }
    static converterParaConsole(texto) {
        try {
            const buffer = iconv.encode(texto, 'utf8');
            return iconv.decode(buffer, 'utf8');
        }
        catch (error) {
            return texto;
        }
    }
    static substituirEmojis(texto) {
        const mapeamentoEmojis = {
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
        Object.entries(mapeamentoEmojis).forEach(([emoji, indicador]) => {
            textoLimpo = textoLimpo.replace(new RegExp(emoji, 'g'), indicador);
        });
        return textoLimpo;
    }
    static processarTexto(texto) {
        const semEmojis = this.substituirEmojis(texto);
        return this.converterParaConsole(semEmojis);
    }
    static inicializar() {
        this.configurarEncoding();
        console.log(this.processarTexto('🔧 Sistema de encoding configurado para suporte a acentos'));
        console.log('Caracteres especiais serao exibidos como indicadores textuais.');
    }
}
exports.EncodingUtils = EncodingUtils;
//# sourceMappingURL=EncodingUtils.js.map