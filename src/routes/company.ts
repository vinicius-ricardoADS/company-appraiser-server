import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { validationFields } from '../middleware/validation_fields';

export async function companyRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify();
    });

    app.post('/company', async (request, reply) => {
        const bodySchema = z.object({
            name: z.string(),
            segment: z.string(),
        });

        const { name, segment } = bodySchema.parse(request.body);

        const isValids = validationFields({
            name,
            segment,
        });

        if (isValids.length > 0) {
            reply.status(401).send({
                message: 'Empty fields',
                emptyFields: isValids
            })
        }

        const company = await prisma.company.create({
            data: {
                name,
                segment
            },
        });

        return company;
    });

    app.get('/company', async (request, reply) => {
        const companys = await prisma.company.findMany({
            orderBy: {
                name: 'asc'
            },
        });

        if (companys.length > 0) {
            reply.send(companys.map((company: { id: number, name: string, segment: string }) => {
                return {
                    id: company.id,
                    name: company.name,
                    segment: company.segment,
                }
            }));
        }
        reply.send({
            message: 'Nothing',
        })

    })
}