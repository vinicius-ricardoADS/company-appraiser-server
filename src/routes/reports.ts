import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { generateCompanyReport } from "../middleware/generate_reports";

export async function reportsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify();
    });

    app.post('/reports', async (request, reply) => {
        const bodySchema = z.object({
            company_id: z.string().uuid(),
        });

        const { company_id } = bodySchema.parse(request.body);

        if (company_id) {
            const company = await prisma.company.findUnique({
                where: {
                    id: company_id,
                },
            })

            if (company) {

                const protocol = request.headers['x-forwarded-proto'] || 'http';
  
                const hostHeader = request.hostname;
                
                const fullUrl = `${protocol}://${hostHeader}`;

                const { fileUrl } = await generateCompanyReport(company, fullUrl);

                reply.status(200).send( fileUrl );
            } else {
                reply.status(401).send({
                    message: 'Company not found',
                });
            }
        } else {
            reply.status(400).send({
                message: 'ID unknow',
            });
        }
    })
}