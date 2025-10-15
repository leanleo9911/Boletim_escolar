"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvaliacaoService = void 0;
const Constantes_1 = require("../models/Constantes");
class AvaliacaoService {
    avaliarAluno(aluno) {
        const mediasPorMateria = this.calcularMediasPorMateria(aluno);
        const mediaGeral = this.calcularMediaGeral(mediasPorMateria);
        const percentualPresenca = this.calcularPercentualPresenca(aluno.faltas);
        const aprovadoPorNota = mediaGeral >= Constantes_1.CONFIG_AVALIACAO.NOTA_MINIMA_APROVACAO;
        const aprovadoPorPresenca = percentualPresenca >= Constantes_1.CONFIG_AVALIACAO.PRESENCA_MINIMA_APROVACAO;
        const aprovado = aprovadoPorNota && aprovadoPorPresenca;
        let motivoReprovacao;
        if (!aprovado) {
            const motivos = [];
            if (!aprovadoPorNota) {
                motivos.push(`média geral ${mediaGeral.toFixed(2)} inferior a ${Constantes_1.CONFIG_AVALIACAO.NOTA_MINIMA_APROVACAO}`);
            }
            if (!aprovadoPorPresenca) {
                motivos.push(`presença ${percentualPresenca.toFixed(1)}% inferior a ${Constantes_1.CONFIG_AVALIACAO.PRESENCA_MINIMA_APROVACAO}%`);
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
    calcularMediasPorMateria(aluno) {
        const medias = {};
        Object.entries(aluno.notas).forEach(([materia, notas]) => {
            const soma = notas.reduce((total, nota) => total + nota, 0);
            medias[materia] = soma / notas.length;
        });
        return medias;
    }
    calcularMediaGeral(mediasPorMateria) {
        const medias = Object.values(mediasPorMateria);
        const somaMedias = medias.reduce((total, media) => total + media, 0);
        return somaMedias / medias.length;
    }
    calcularPercentualPresenca(faltas) {
        const aulasPresentes = Constantes_1.CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO - faltas;
        return (aulasPresentes / Constantes_1.CONFIG_AVALIACAO.TOTAL_AULAS_PERIODO) * 100;
    }
    obterMateriasEmRecuperacao(mediasPorMateria) {
        const materiasRecuperacao = [];
        Object.entries(mediasPorMateria).forEach(([materia, media]) => {
            if (media < Constantes_1.CONFIG_AVALIACAO.NOTA_MINIMA_APROVACAO) {
                materiasRecuperacao.push(materia);
            }
        });
        return materiasRecuperacao;
    }
    classificarDesempenho(mediaGeral) {
        if (mediaGeral >= 9.0)
            return 'Excelente';
        if (mediaGeral >= 8.0)
            return 'Bom';
        if (mediaGeral >= 7.0)
            return 'Regular';
        if (mediaGeral >= 5.0)
            return 'Insuficiente';
        return 'Crítico';
    }
}
exports.AvaliacaoService = AvaliacaoService;
//# sourceMappingURL=AvaliacaoService.js.map