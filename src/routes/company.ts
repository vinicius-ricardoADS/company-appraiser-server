import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid'; 

export async function companyRoutes(app: FastifyInstance) {
    app.post('/company', async (request, reply) => {
        const bodySchema = z.object({
            name: z.string(),
            segment: z.string(),
        });

        const { name, segment } = bodySchema.parse(request.body);

        const company = await prisma.company.create({
            data: {
                id: uuidv4(),
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
            reply.send(companys.map((company: { id: string, name: string, segment: string }) => {
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