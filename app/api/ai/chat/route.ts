import { tools } from '@/ai/tools';
import { model } from '@/lib/google-ai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model,
        messages,
        tools,
        system: `You are an expert course recommendation assistant. Help students find the most suitable courses based on their interests and budgets. Currency starts with RM.`,
    });

    return result.toDataStreamResponse();
}