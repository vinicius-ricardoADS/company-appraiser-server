import { resolve } from 'node:path'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { prisma } from '../lib/prisma'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880,
      },
    });

    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const writeStream = createWriteStream(
      resolve(__dirname, '..', '..', 'uploads', upload.filename),
    )

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${upload.filename}`, fullUrl).toString()

    /* const lastProduct = await prisma.product.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    await prisma.product.update({
      where: {
        id: lastProduct?.id,
      },
      data: {
        imageUrl: fileUrl
      }
    }) */

    return { fileUrl };
  });
}
