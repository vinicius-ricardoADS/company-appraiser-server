import PDFDocument from 'pdfkit';
import PDFDocumentWithTables from 'pdfkit-table';
import { createWriteStream } from "node:fs";
import { resolve } from 'node:path'
import sharp from 'sharp';
import { Company } from '@prisma/client';
import { prisma } from '../lib/prisma';

type TableDocument = {
    title: string;
    subtitle: string;
    headers: string[];
    rows: string[][];
}

export async function generateCoupon(id: string, name: string, image: string | null, urlHost: string) {
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

    doc.pipe(createWriteStream(resolve(__dirname, '..', '..', 'uploads', `${name.toLowerCase()}-discount.pdf`)));
    doc.end();

    const fileUrl = new URL(`/uploads/${name.toLowerCase()}-discount.pdf`, urlHost).toString()

    return { fileUrl };
}

export async function generateCompanyReport(
    company: Company,
    fullUrl: string
  ) {
    const doc = new PDFDocumentWithTables({
      margin: 30,
      size: 'A4',
      compress: true,
    });
  
    const tamanhoCodigo = 14;
    const tamanhoTexto = 12;
  
    doc.font('Helvetica-Bold').fontSize(tamanhoCodigo);
  
    doc.font('Helvetica').fontSize(tamanhoTexto);
  
    const products = await prisma.product.findMany({
      where: {
        company_id: company.id,
      },
      distinct: ['id'],
      include: {
        Evaluations: {
          select: {
            score: true,
            preferences: true,
            would_buy: true,
          },
        },
      },
    });
  
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(12);
  
    // Cabeçalhos da tabela
    const tableHeaders = ['Produto', 'Taxa de aceitação', 'Avaliações'];
  
    doc.fillColor('black');
  
    doc.font('Helvetica').fontSize(10);

    const table: TableDocument = {
        title: 'Relatório',
        subtitle: `Relatório da empresa ${company.name}`,
        headers: tableHeaders,
        rows: [],
    };
  
    products.forEach(async (product) => {
        let totalScore = 0; 
        let preferences = '';
        let would_buy = '';
      
        product.Evaluations.forEach((evaluation) => {
          const score = evaluation.score;
          preferences += evaluation.preferences + '\n';
          would_buy += 'R$' + evaluation.would_buy + '\n';
          totalScore += score;
        });

        const evaluation_percent = ( totalScore / product.count_evaluations ) * 10;
      
        const row = [
          product.model,
          evaluation_percent.toString() + '%', 
          product.count_evaluations.toString(),
        ];

        doc.font("Helvetica").fontSize(tamanhoTexto);
        doc.text(`Preferências sobre o produto ${product.model}`, 
        { align: "center" });

        doc.moveDown();

        doc.text(`${preferences}`, 
        { align: "center" });

        doc.moveDown();

        doc.text(`Valores sugeridos de compra sobre o produto ${product.model}`, 
        { align: "center" });

        doc.moveDown();

        doc.text(`${would_buy}`, 
        { align: "center" });

        doc.moveDown();
      
        table.rows.push([...row]);
    });

    const tableX = (doc.page.width - calculateTableWidth(table, doc)) / 2;

    await doc.table(table, {
        x: tableX,
        width: 300,
    });
  
    doc.pipe(
      createWriteStream(
        resolve(
          __dirname,
          '..',
          '..',
          'uploads',
          `${company.name.toLowerCase()}-report.pdf`
        )
      )
    );
    doc.end();
  
    const fileUrl = new URL(
      `/uploads/${company.name.toLowerCase()}-discount.pdf`,
      fullUrl
    ).toString();
  
    return { fileUrl };
}

function calculateTableWidth(table: TableDocument, doc: PDFDocumentWithTables) {
    const cellPadding = 10;
    const totalCellWidth = table.headers.length * 100;
  
    return totalCellWidth + cellPadding * 2;
}
  