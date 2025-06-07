import { isCurrentUserAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { AdminCreateUserSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
        }

        const jsonData = await req.json();
        const validatedData = AdminCreateUserSchema.safeParse(jsonData);

        if (!validatedData.success) {
            return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
        }

        const { data: { email, name, identificationNo, confirmPassword } } = validatedData;


        const isEmailExist = await db.user.findFirst({
            where: {
                email
            },
        });

        if (isEmailExist) {
            return NextResponse.json({ error: "Email already exist" }, { status: 400 })
        }

        const hashedPassword = await hashPassword(confirmPassword);

        const user = await db.user.create({
            data: {
                email,
                name,
                identificationNo,
                password: hashedPassword,
                emailVerified: new Date(),
            },
        })

        return NextResponse.json({
            success: "User created",
            user,
        }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}