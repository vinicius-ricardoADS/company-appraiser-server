import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

export const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

export const comparePassword = async (passwordEntered: string): Promise<boolean> => {
    const users = await prisma.user.findMany({
        orderBy: {
            name: 'asc',
        }
    });

    for (const user of users) {
        const result = await bcrypt.compare(passwordEntered, user.password);
        if (result) return true;
    }

    return false;
}