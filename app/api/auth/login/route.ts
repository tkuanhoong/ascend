import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/resend";
import { generateVerificationToken } from "@/lib/tokens";
// import { sendVerificationEmail } from "@/lib/resend";
// import { generateVerificationToken } from "@/lib/tokens";
import { LoginSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const values = await req.json();

        const validatedFields = LoginSchema.safeParse(values);

        if (!validatedFields.success) {
            return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
        }

        const { email, password } = validatedFields.data;

        const existingUser = await db.user.findUnique({
            where: {
                email,
            }
        });

        if (!existingUser || !existingUser.email || !existingUser.password) {
            return NextResponse.json({ error: "Email does not exist!" }, { status: 404 });
        }

        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(existingUser.email!);
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
            return NextResponse.json({ success: "Confirmation email sent! Please check your email to verify your account." }, { status: 201 });
        }



        try {
            const redirectUrl = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            return NextResponse.json({ success: "Logged in successfully", redirectUrl }, { status: 200 });
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return NextResponse.json({ error: "Invalid credentials!" }, { status: 401 });
                    case "AccessDenied":
                        return NextResponse.json({ error: "Access Denied" }, { status: 401 })
                    default:
                        return NextResponse.json({ error: "Something went wrong!" });
                }
            }
            throw error;
        }


    } catch (error) {
        console.log("[LOGIN]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}