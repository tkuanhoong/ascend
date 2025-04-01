import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/hash';
import { ResetPasswordSchema } from '@/lib/zod';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { token: passwordResetToken } = body;

        if (!passwordResetToken) {
            return NextResponse.json({ error: "Missing Token!" }, { status: 400 });
        }

        const validatedResult = ResetPasswordSchema.safeParse(body);

        if (!validatedResult.success) {
            return NextResponse.json({ error: "Invalid Input!" }, { status: 400 });
        }

        const { password } = validatedResult.data;

        const existingToken = await getPasswordResetTokenByToken(passwordResetToken);

        if (!existingToken) {
            return NextResponse.json({ error: "Token does not exist!" }, { status: 404 });
        }

        const hasExpired = new Date() > new Date(existingToken.expiresAt);

        if (hasExpired) {
            return NextResponse.json({ error: "Token has expired!" }, { status: 400 });
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found!" }, { status: 404 });
        }

        // generate hashed password
        const hashedPassword = await hashPassword(password);

        // update user password
        await db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                password: hashedPassword
            }
        });

        // delete password reset token record
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        });

        return NextResponse.json({ success: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('[RESET-PASSWORD]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}