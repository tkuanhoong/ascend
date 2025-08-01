import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();
    const header = await headers();
    const signature = header.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (error) {
        return new NextResponse(`Webhook Error: ${error}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;
    const amountString = session?.metadata?.amount;
    const amount = Number(amountString);

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 })
        }
        await db.purchase.create({
            data: {
                courseId,
                userId,
                amount
            }
        });
    } else {
        return new NextResponse(`Webhook Error: Unhandled event type: ${event.type}`, { status: 200 })
    }

    return new NextResponse(null, { status: 200 })
}