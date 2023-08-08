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

        const company = await prisma.company.findUnique({
            where: {
                id: company_id
            },
        });

        if (company) {

            const product = await prisma.product.create({
                data: {
                  model,
                  description,
                  avaluation_value,
                  company_id
                },
            })
          
            reply.status(200).send({product});
        }
      
        reply.status(500).send({
            message: 'Company not found',
        });
    });

    app.get('/products', async (request, reply) => {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (products.length > 0) {
            reply.send(products.map((product: { 
                id: number,
                avaluation_value: number,
                description: string,
                model: string,
                imageUrl: string | null,
            }) => {
                return {
                    id: product.id,
                    avaluation_value: product.avaluation_value,
                    description: product.description,
                    model: product.model,
                    imageUrl: product.imageUrl
                }
            }));
        }
        reply.send({
            message: 'No product',
        })
    })
}