import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Missing Token!" }, { status: 400 });
        }

        // check if token exists
        const existingToken = await getVerificationTokenByToken(token);

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

        // update user email verified
        await db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                emailVerified: new Date(),
                email: existingToken.email,
            },
        })

        // clean up for the used token
        await db.verificationToken.delete(
            {
                where: {
                    id: existingToken.id
                }
            }
        )

        return NextResponse.json({ success: "Account Verified! Login to your account now!" }, { status: 200 });

    } catch (error) {
        console.log("[NEW-VERIFICATION]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


}