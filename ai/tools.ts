import { CourseStatus } from '@prisma/client';
import { currentUserId } from '@/lib/auth';
import { db } from '@/lib/db';
import { tool as createTool } from 'ai';
import { z } from 'zod';

const MAX_RECOMMENDED_COURSE = 5

export const coursesTool = createTool({
    description: 'Find and recommend courses based on user interest and budget constraints',
    parameters: z.object({
        interest: z.string().min(1, 'Interest cannot be empty'),
        budget: z.number().min(0, 'Budget must be non-negative'),
    }),
    execute: async function ({ interest, budget }) {
        try {
            const userId = await currentUserId(); // Get current user ID (returns null if not logged in)

            // Prepare the interest for full-text search.
            // For better search, convert "web development" to "web & development"
            // or let the DB's full-text search handle phrases. For now, a simple split:
            const searchTerms = interest.split(' ').filter(Boolean).join(' & ');

            const courses = await db.course.findMany({
                where: {
                    status: CourseStatus.PUBLISHED, // Only recommend published courses
                    // Exclude already purchased courses for authenticated users
                    ...(userId && {
                        purchases: {
                            none: {
                                userId
                            }
                        }
                    }),
                    price: {
                        lte: budget // Strict budget filter
                    },
                    AND: [ // Ensure ALL conditions in this block are met
                        {
                            OR: [ // At least one of these interest-based conditions must be true
                                {
                                    title: {
                                        search: searchTerms,
                                    }
                                },
                                {
                                    description: {
                                        search: searchTerms,
                                    }
                                },
                                {
                                    category: {
                                        name: searchTerms,
                                    }
                                }
                            ]
                        }
                    ]
                },
                include: {
                    category: true, // Include category details
                },
                orderBy: [
                    // Prioritize relevance based on full-text search
                    {
                        _relevance: {
                            fields: ['title', 'description'],
                            search: searchTerms,
                            sort: 'desc'
                        }
                    },
                ],
                take: MAX_RECOMMENDED_COURSE, // Limit the number of recommendations
            });

            return courses;

        } catch (error) {
            console.error('Error in getRecommendCourses tool:', error);
            // Throw a specific error that the AI can interpret or a generic one
            throw new Error('Failed to retrieve course recommendations. Please try again or rephrase your request.');
        }
    },
});

export const tools = {
    getRecommendCourses: coursesTool,
};