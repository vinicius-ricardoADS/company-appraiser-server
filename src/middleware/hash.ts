import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

export const hashPassword = async (password: string) => {
    await bcrypt.hash(password, 10)
    .then(hash => {
        return hash;
    })
    .catch(err => {
        console.log(err);
    });
}

export const comparePassword = async (passwordEntered: string): Promise<boolean> => {
    const users = await prisma.user.findMany({
        orderBy: {
            name: 'asc',
        }
    });

    users.map((user:
        {
            id: number,
            name: string,
            cpf: string,
            birth_date: Date,
            email: string,
            password: string,
        }) => {
            bcrypt.compare(passwordEntered, user.password)
            .then(() => {
                return true;
            })
            .catch(err => {
                console.log(err);
            });
        });
    return false;
    
}