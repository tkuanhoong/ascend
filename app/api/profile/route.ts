import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { ProfileSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const existingUser = await getUserById(user.id);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found!" }, { status: 404 });
        }

        return NextResponse.json({ user: existingUser });

    } catch (error) {
        console.log('[PROFILE]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}

export async function PATCH(req: NextRequest) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised!" }, { status: 401 });
        }

        const jsonData = await req.json();

        const validatedResult = ProfileSchema.safeParse(jsonData);

        if (!validatedResult.success) {
            return NextResponse.json({ error: "Invalid Inputs!" }, { status: 400 });
        }

        const updatedData = validatedResult.data;


        const existingUser = getUserById(user.id);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found!" }, { status: 404 });
        }

        // Update user
        const updatedUser = await db.user.update({
            where: {
                id: user.id
            },
            data: {
                ...updatedData
            }
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.log('[PROFILE]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }


}