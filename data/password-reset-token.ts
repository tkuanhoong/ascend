import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.passwordResetToken.findUnique({
            where: {
                token
            }
        });
        return verificationToken;
    } catch {
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.passwordResetToken.findFirst({
            where: {
                email
            }
        });
        return verificationToken;
    } catch {
        return null;
    }
}