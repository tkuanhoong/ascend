import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

const DOMAIN = 'ascend-uat.tech'

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.APP_URL}/auth/new-verification?token=${token}`;
    await resend.emails.send({
        from: `noreply@${DOMAIN}`,
        to: email,
        subject: "Verify your email",
        html: `<a href="${confirmLink}">Click here to verify your email</a>`,
    });
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const passwordResetLink = `${process.env.APP_URL}/auth/password-reset?token=${token}`;
    await resend.emails.send({
        from: `noreply@${DOMAIN}`,
        to: email,
        subject: "Reset your password",
        html: `<a href="${passwordResetLink}">Click here to reset your password</a>`,
    });
}