import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { hashPassword } from '../middleware/hash';

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
    });

    app.get('/users', async (request, reply) => {
        const users = await prisma.user.findMany({
            orderBy: {
                birth_date: 'asc'
            },
        });

        if (users.length > 0) {
            reply.status(200).send(
                users.map((user: {
                    id: number,
                    name: string,
                    cpf: string,
                    birth_date: Date,
                    email: string,
                    password: string,
                }) => {
                    return {
                        id: user.id,
                        name: user.name,
                        cpf: user.cpf,
                        birth_date: user.birth_date,
                        email: user.email,
                        password: user.password,
                    }
                })
            );
        }

        reply.send({
            message: 'No users',
        })
    })
}