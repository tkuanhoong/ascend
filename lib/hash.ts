import { compare, hash } from 'bcryptjs';

export const hashPassword = async (password: string) => {
    const hashPassword = await hash(password, 12);
    return hashPassword;
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
    const isCorrectPassord = await compare(password, hashedPassword);
    return isCorrectPassord;
}

