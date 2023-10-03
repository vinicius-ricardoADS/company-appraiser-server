import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { hashPassword } from '../middleware/hash';
import { validationFields } from '../middleware/validation_fields';

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', async (request, reply) => {
        const userSchema = z.object({
            name: z.string(),
            cpf: z.string(),
            birth_date: z.string(),
            email: z.string(),
            password: z.string(),
        });

        const {
            name,
            cpf,
            birth_date,
            email,
            password
        } = userSchema.parse(request.body);

        const isValids = validationFields({
            name,
            cpf,
            birth_date,
            email,
            password
        });

        if (isValids.length > 0) {
            reply.status(401).send({
                message: 'Fields emptys',
                emptysFields: isValids
            });
        } else {
            
            const passwordEncrypting = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    name,
                    cpf,
                    birth_date: new Date(birth_date),
                    email,
                    password: passwordEncrypting
                },
            });
    
            if (user) {
                reply.status(200).send({
                    user
                });
            }
    
            reply.status(400).send({
                message: 'Error'
            });
        }
    });

    app.get('/users', async (request, reply) => {
        const users = await prisma.user.findMany({
            orderBy: {
                birth_date: 'asc'
            },
        });

        if (users.length > 0) {
            reply.status(200).send(
                users.map((user) => {
                    return {
                        id: user.id,
                        name: user.name,
                        cpf: user.cpf,
                        birth_date: user.birth_date,
                        email: user.email,
                        password: user.password,
                        role: user.role,
                    }
                })
            );
        }

        reply.send({
            message: 'No users',
        })
    });

    app.get('/users/:email', async (request, reply) => {
        const paramsSchema = z.object({
            email: z.string(),
        });

        const { email } = paramsSchema.parse(request.params);

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email,
            },
        });

        if (user) {
            reply.status(200).send(user);
        } else {
            reply.status(400).send({
                message: 'Not found',
            })
        }
    });

    app.put('/users/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        });

        const bodySchema = z.object({
            password: z.string(),
        });

        const { id } = paramsSchema.parse(request.params);

        const { password } = bodySchema.parse(request.body);

        const user = await prisma.user.findFirstOrThrow({
            where: {
                id
            }
        });

        if (user) {
            await prisma.user.update({
                where: {
                    id
                },
                data: {
                    password: await hashPassword(password)
                }
            }).then(() => {
                reply.status(200).send({
                    message: 'Success',
                });
            }).catch(async (error) => {
                reply.status(401).send({
                    message: error,
                });
            });
        }
    })

    app.delete('/users/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string(),
        });

        const { id } = paramsSchema.parse(request.params);

        await prisma.user.delete({
            where: {
                id,
            },
        }).then(() => {
            reply.status(200).send({
                message: 'Success',
            });
        }).catch(async (error) => {
            reply.status(401).send({
                message: error,
            });
        });
    })
}