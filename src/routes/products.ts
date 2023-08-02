import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function productRoutes(app: FastifyInstance) {
    app.post('/product', async (request, reply) => {
        const bodySchema = z.object({
            model: z.string(),
            description: z.string(),
            avaluation_value: z.boolean(),
            company_id: z.bigint(),
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
}