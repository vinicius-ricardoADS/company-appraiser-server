import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { validationFields } from "../middleware/validation_fields";

export async function productRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify();
    });

    app.post('/products', async (request, reply) => {
        const bodySchema = z.object({
            model: z.string(),
            description: z.string(),
            discount_value: z.number(),
            company_id: z.number(),
        })
      
        const { model, description, discount_value, company_id } = bodySchema.parse(request.body);

        const isValids = validationFields({
            model,
            description,
            discount_value,
            company_id,
        });

        if (isValids.length > 0) {
            reply.status(401).send({
                message: 'Empty fields',
                emptyFields: isValids
            });
        } else {
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
                      discount_value,
                      company_id
                    },
                })
              
                reply.status(200).send({product});
            }

            reply.status(500).send({
                message: 'Company not found',
            });
        }
        
    });

    app.get('/products', async (request, reply) => {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                Company: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (products.length > 0) {
            reply.send(products.map((product) => {
                return {
                    id: product.id,
                    discount_value: product.discount_value,
                    description: product.description,
                    model: product.model,
                    imageUrl: product.imageUrl,
                    company: product.Company.name,
                }
            }));
        }
        reply.send({
            message: 'No product',
        })
    })
}