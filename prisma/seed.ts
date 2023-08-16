import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/middleware/hash";

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.create({
        data: {
            name: 'vinicius',
            cpf: '111.222.333-44',
            birth_date: new Date('03/04/2002'),
            email: 'vinicius@gmail.com',
            password: await hashPassword('1234'),
            role: Role.ADMIN
        }
    });

    console.log(admin);
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.log(e);
    await prisma.$disconnect()
    process.exit(1);
})