import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { comparePassword } from '../middleware/hash';
import { prisma } from '../lib/prisma';
import { validationFields } from '../middleware/validation_fields';

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', async (request, reply) => {
        const userSchema = z.object({
            email: z.string(),
            password: z.string(),
        });

        const { email, password } = userSchema.parse(request.body);

        const isValids = validationFields({
            email,
            password,
        });

        if (isValids.length > 0) {
            reply.status(500).send({
                message: 'Empty fields',
                emptyFields: isValids
            })
        } else {

            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });
    
            if (!user) {
                reply.status(401).send({
                    message: 'Email or password invalids',
                });
            }
    
            const isSamePassword = await comparePassword(password, user!.password);
    
            if (!isSamePassword) {
                reply.status(401).send({
                    message: 'Email or password invalids',
                });
            }
    
            const token = app.jwt.sign(
                {
                    email: user!.email,
                },
                {
                    sub: user!.id,
                }
            );
    
            reply.status(200).send({
                token,
            })
        }
    })
}