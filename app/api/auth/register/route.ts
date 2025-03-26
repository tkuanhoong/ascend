import { db } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { RegisterSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const values = await req.json();

        const validatedFields = RegisterSchema.safeParse(values);

        if (!validatedFields.success) {
            return new NextResponse("Invalid Input", { status: 400 });
        }

        const { email, password, name } = values;

        const existingUser = await db.user.findUnique({
            where: {
                email,
            }
        });

        if (existingUser) {
            return new NextResponse("Email already exists", { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.log("[REGISTER]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}
