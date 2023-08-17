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

    const imageUrl = resolve(__dirname, '..', '..', 'uploads', fileName);

    const imageSize = sharp(imageUrl).metadata();

    const imageWidth = (await imageSize).width;
    const imageHeight = (await imageSize).height;

    const centerX = (doc.page.width - imageWidth!) / 2;
    const centerY = (doc.page.height - imageHeight!) / 2;

    if (fileName.endsWith('.avif')) {
        const jpegOutputPath = `${fileName}.jpg`;

        await sharp(imageUrl).toFile(jpegOutputPath);

        doc.font("Helvetica-Bold").fontSize(tamanhoCodigo);
        doc.image(jpegOutputPath, centerX, centerY, {
            width: imageWidth, height: imageHeight 
        })
    } else {
        doc.font("Helvetica-Bold").fontSize(tamanhoCodigo);
        doc.image(imageUrl, centerX, centerY, {
            width: imageWidth, height: imageHeight 
        });
    }
    doc.text("Código: " + id, { align: "center" });
    doc.moveDown();

    doc.font("Helvetica").fontSize(tamanhoTexto);
    doc.text("Obrigado pela sua avaliação! Este é um comprovante gerado para " +
    "utilizá-lo como desconto na compra do produto.", { align: "justify" });

    doc.pipe(createWriteStream(resolve(__dirname, '..', '..', 'reports', `${name.toLowerCase()}-discount.pdf`)));
    doc.end();
}