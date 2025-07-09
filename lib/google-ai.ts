import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleAi = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
    // custom settings
});

export const model = googleAi("gemini-2.0-flash");