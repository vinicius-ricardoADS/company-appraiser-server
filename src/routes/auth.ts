import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { comparePassword } from '../middleware/hash';
import { prisma } from '../lib/prisma';

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', async (request, reply) => {
        const userSchema = z.object({
            email: z.string(),
            password: z.string(),
        });

        const { email, password } = userSchema.parse(request.body);

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            reply.status(500).send({
                message: 'Email or password invalids',
            });
        }

        const isSamePassword = await comparePassword(password, user!.password);

        if (!isSamePassword) {
            reply.status(500).send({
                message: 'Email or password invalids',
            });
        }

        const token = app.jwt.sign(
            {
                name: user?.name,
            },
            {
                sub: user?.id.toString(),
                expiresIn: 300,
            }
        );

        reply.status(200).send({
            token
        })
    })
}