import PDFDocument from 'pdfkit';
import { createWriteStream } from "node:fs";
import { resolve } from 'node:path'
import sharp from 'sharp';

export async function generateReport(id: string, name: string, image: string | null) {
    const doc = new PDFDocument({ 
        size: "A4",
        compress: true, 
    });

    const tamanhoCodigo = 14;
    const tamanhoTexto = 12;

    const parts = image!.split('/');
    const fileName = parts[parts.length - 1];

    doc.font("Helvetica-Bold").fontSize(tamanhoCodigo);
    doc.image(resolve(__dirname, '..', '..', 'uploads', fileName), {
        align: 'center',
        valign: 'center',
    })
    doc.text("Código: ABC" + id, { align: "center" });
    doc.moveDown();

    doc.font("Helvetica").fontSize(tamanhoTexto);
    doc.text("Obrigado pela sua avaliação! Este é um comprovante gerado para " +
    "utilizá-lo como desconto na compra do produto.", { align: "justify" });

    doc.pipe(createWriteStream(resolve(__dirname, '..', '..', 'reports', `${name.toLowerCase()}-discount.pdf`)));
    doc.end();
}