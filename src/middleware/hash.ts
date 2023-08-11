import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
}

export const comparePassword = async (passwordEntered: string, passwordHash: string): Promise<boolean> => {
    return await bcrypt.compare(passwordEntered, passwordHash);
}