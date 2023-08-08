import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function productRoutes(app: FastifyInstance) {
    app.post('/products', async (request, reply) => {
        const bodySchema = z.object({
            model: z.string(),
            description: z.string(),
            avaluation_value: z.number(),
            company_id: z.number(),
        })
      
        const { model, description, avaluation_value, company_id } = bodySchema.parse(request.body);
      
        const product = await prisma.product.create({
            data: {
              model,
              description,
              avaluation_value,
              company_id
            },
        })
      
        return product
    });

    app.get('/products', async (request, reply) => {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (products.length > 0)
            reply.send({
                products
            });
        reply.send({
            message: 'Nothing',
        })
    })
}