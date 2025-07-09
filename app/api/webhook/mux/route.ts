import { db } from "@/lib/db";
import { mux } from "@/lib/mux";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.text();
    const header = await headers();

    try {
        mux.webhooks.verifySignature(body, header, process.env.MUX_WEBHOOK_SECRET);
    } catch (error) {
        console.log('[WEBHOOK_MUX]', error);
        return NextResponse.json({ error: `Webhook Error: ${error}` }, { status: 400 })
    }

    const event = mux.webhooks.unwrap(body, header, process.env.MUX_WEBHOOK_SECRET);


    if (event.type === "video.asset.created") {
        const { data } = event;
        const { meta, playback_ids } = data;

        await db.video.create({
            data: {
                chapterId: meta?.external_id as string,
                assetId: data.id,
                playbackId: playback_ids?.[0]?.id,
            }
        });
    } else if (event.type === "video.asset.ready") {
        const { data } = event;
        const { meta } = data;

        await db.video.update({
            where: {
                assetId: data.id,
                chapterId: meta?.external_id as string,
            },
            data: {
                isReady: true,
            }
        });
    } else {
        return NextResponse.json({ error: `Webhook Error: Unhandled event type: ${event.type}` }, { status: 200 })
    }

    return NextResponse.json(null, { status: 200 });
}