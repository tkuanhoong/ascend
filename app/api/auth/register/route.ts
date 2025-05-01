import { db } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { sendVerificationEmail } from "@/lib/resend";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const values = await req.json();

        const validatedFields = RegisterSchema.safeParse(values);

        if (!validatedFields.success) {
            return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
        }

        const { email, password, name, identityNo } = validatedFields.data;

        const existingUser = await db.user.findUnique({
            where: {
                email,
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already exist" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        await db.user.create({
            data: {
                email,
                name,
                identificationNo: identityNo,
                password: hashedPassword,
            },
        });

        // Send email verification with token
        const { email: emailSendingTo, token } = await generateVerificationToken(email);
        await sendVerificationEmail(emailSendingTo, token);

        return NextResponse.json({ success: `Verification email sent to ${emailSendingTo}. Please check your email.` }, { status: 201 });
    } catch (error) {
        console.log("[REGISTER]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}
