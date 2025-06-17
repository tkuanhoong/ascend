import { getAllCategories } from '@/data/category';
import { model } from '@/lib/google-ai';
import { AICourseImportSchema } from '@/lib/zod';
import { generateObject } from 'ai'
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json('Invalid prompt', { status: 400 })
    }

    const categories = await getAllCategories();

    const result = await generateObject({
      model,
      schema: AICourseImportSchema,
      messages: [
        {
          role: 'system',
          content: `You are an expert course creator. Generate a comprehensive course structure based on the user's description. 

IMPORTANT: You must respond with ONLY a valid JSON object that matches this exact structure:

{
  "title": "Course Title",
  "description": "Course description",
  "price": 99.99,
  "categoryId": "category-id-or-null",
  "sections": [
    {
      "title": "Section Title",
      "position": 1,
      "level": "BEGINNER|INTERMEDIATE|ADVANCED",
      "estimatedTime": 5,
      "chapters": [
        {
          "title": "Chapter Title",
          "description": "Chapter description",
          "position": 1,
          "isFree": false
        }
      ]
    }
  ]
}

Guidelines:
- Create 3-6 sections with logical progression
- Each section should have 3-8 chapters
- Set appropriate difficulty levels (BEGINNER, INTERMEDIATE, ADVANCED)
- Estimate realistic time in hours for each section
- Make 1-2 chapters per course free (isFree: true)
- Set a reasonable price based on course complexity
- Include detailed descriptions for course and chapters
- Ensure positions are sequential (1, 2, 3, etc.)
- category-id mapping can refer to this mapping: ${JSON.stringify(categories)}
- For "categoryId" field, study the category-id mapping, match the suitable id from the category-id mapping, if no suitable category, set it to null

Respond with ONLY the JSON object, no additional text or formatting.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toJsonResponse();
  } catch (error) {
    console.error('Error generating course:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}