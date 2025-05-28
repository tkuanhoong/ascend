import { CourseStatus } from '@/generated/prisma';
import { db } from '@/lib/db';
import { tool as createTool } from 'ai';
import { z } from 'zod';

export const coursesTool = createTool({
    description: 'Display the recommended courses',
    parameters: z.object({
        interest: z.string(),
        budget: z.number()
    }),
    execute: async function ({ interest, budget }) {


        const courses = await db.course.findMany({
            where: {
                status: CourseStatus.PUBLISHED,
                OR: [
                    {
                        price: {
                            lte: budget
                        },
                    }, {
                        category: {
                            name: {
                                search: interest
                            }
                        }
                    }

                ]
            },
            include: { category: true },
            orderBy: {
                _relevance: {
                    fields: ['title'],
                    search: interest,
                    sort: 'desc',
                },
            },
        });
        return courses.slice(0, 5); // Return top 5
    },
});

export const tools = {
    getRecommendCourses: coursesTool,
};