import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        return NextResponse.json(user, { status: 200 });


    } catch (error) {
        console.log("[USER]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }


}