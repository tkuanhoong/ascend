import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        return NextResponse.json(user, { status: 200 });


    } catch (error) {
        console.log("[USER]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }


}