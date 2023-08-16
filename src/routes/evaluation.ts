import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { validationFields } from "../middleware/validation_fields";
import { generateReport } from "../middleware/generate_reports";

export async function evaluationRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify();
    });

    app.post('/evaluations', async (request, reply) => {
        const evaluationSchema = z.object({
            score: z.number(),
            preferences: z.string(),
            would_buy: z.number(),
            product_id: z.string().uuid(),
        });

        const { score, preferences, would_buy, product_id } = evaluationSchema.parse(request.body);

        const isValids = validationFields({
            score,
            would_buy,
            product_id
        });

        if (isValids.length > 0) {
            reply.status(401).send({
                message: 'Empty fields',
                emptyFields: isValids
            });
        } else {
            const product = await prisma.product.findUnique({
                where: {
                    id: product_id
                }
            });

            if (!product) reply.status(401).send({ message: 'Not found product' });

            const evaluation = await prisma.evaluations.create({
                data: {
                    score,
                    would_buy,
                    preferences,
                    product_id
                }
            });

            generateReport(product!.id, product!.model, product!.imageUrl)

            reply.status(200).send({ evaluation });
        }
    });

    app.get('/evaluations', async (request, reply) => {
        const evaluations = await prisma.evaluations.findMany({
            orderBy: {
                score: 'asc'
            },
            include: {
                product: {
                    select: {
                        model: true,
                        company: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
            },
        });

        if (evaluations.length > 0) {
            reply.status(200).send(evaluations.map((evaluation) => {
                return {
                    id: evaluation.id,
                    score: evaluation.score,
                    preferences: evaluation.preferences,
                    would_buy: evaluation.would_buy,
                    model: evaluation.product.model,
                    company: evaluation.product.company.name,
                }
            }))
        }
    })
}