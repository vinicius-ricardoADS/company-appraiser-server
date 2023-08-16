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
        } else {

            const company = await prisma.company.create({
                data: {
                    name,
                    segment
                },
            });
    
            return company;
        }
    });

    app.get('/company', async (request, reply) => {
        const companys = await prisma.company.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                products: {
                    distinct: 'id'
                }
            }
        });

        if (companys.length > 0) {
            reply.send(companys.map((company) => {
                return {
                    id: company.id,
                    name: company.name,
                    segment: company.segment,
                    products: company.products,
                }
            }));
        }
        reply.send({
            message: 'Nothing',
        })

    });

    app.put('/company/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        });

        const bodySchema = z.object({
            nameEntered: z.string().nullable(),
            segmentEntered: z.string().nullable(),
        });

        const { id } = paramsSchema.parse(request.params);

        const { nameEntered, segmentEntered } = bodySchema.parse(request.body);

        const company = await prisma.company.findFirstOrThrow({
            where: {
                id,
            },
        });

        const companyUpdate = await prisma.company.update({
            where: {
                id
            },
            data: {
                name: nameEntered === null ? company.name : nameEntered,
                segment: segmentEntered === null ? company.segment : segmentEntered
            }
        });

        if (companyUpdate) reply.status(200).send({ companyUpdate });

        reply.status(401).send({
            message: 'Error'
        })
    })

    app.delete('/company/:id', async (request, reply) => {
        const paramsShema = z.object({
            id: z.string().uuid(),
        });

        const { id } = paramsShema.parse(request.params);

        await prisma.company.delete({
            where: {
                id,
            },
        });
    })
}