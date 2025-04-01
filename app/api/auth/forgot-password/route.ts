import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/resend';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ForgotPasswordSchema } from '@/lib/zod';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validatedResult = ForgotPasswordSchema.safeParse(body);

        if (!validatedResult.success) {
            return NextResponse.json({ error: 'Invalid Input!' }, { status: 400 })
        }

        const { email } = validatedResult.data;

        const existingUser = await getUserByEmail(email);

        if (!existingUser || !existingUser.email) {
            return NextResponse.json({ error: 'User not found!' }, { status: 404 })
        }

        const { email: emailSendingTo, token } = await generatePasswordResetToken(existingUser.email);

        await sendPasswordResetEmail(emailSendingTo, token);

        return NextResponse.json({ success: `Reset password link sent successfully to: ${emailSendingTo}` });
    } catch (error) {
        console.log('[FORGOT-PASSWORD]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}