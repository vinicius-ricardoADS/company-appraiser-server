import PDFDocument from 'pdfkit';
import { createWriteStream } from "node:fs";
import { resolve } from 'node:path'

export function generateReport(id: string, name: string) {
    const doc = new PDFDocument({ 
        size: "A4",
        compress: true, 
    });

    // Tamanho da fonte para o código e o restante do texto
    const tamanhoCodigo = 14;
    const tamanhoTexto = 12;

    // Insere o conteúdo desejado no documento PDF
    doc.font("Helvetica-Bold").fontSize(tamanhoCodigo);
    doc.text("Código: ABC" + id, { align: "center" });
    doc.moveDown(); // Move para a próxima linha

    doc.font("Helvetica").fontSize(tamanhoTexto);
    doc.text("Obrigado pela sua avaliação! Este é um comprovante gerado para " +
    "utilizá-lo como desconto na compra do produto.", { align: "justify" });

    // Salva o documento PDF em um arquivo
    doc.pipe(createWriteStream(resolve(__dirname, '..', '..', 'reports', `${name.toLowerCase()}-discount.pdf`)));
    doc.end();
}