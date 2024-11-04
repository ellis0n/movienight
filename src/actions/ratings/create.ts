import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, RatingsDB } from 'astro:db';

export const create = {
    createRating: defineAction({
        accept: 'form',
        input: z.object({
            movieId: z.number(),
            score: z.number().min(1).max(10),
            viewerId: z.number(),
        }),
        handler: async ({ movieId, score, viewerId }) => {
            try {
                const newRating = await db.insert(RatingsDB)
                    .values({
                        _id: crypto.randomUUID(),
                        movieId,
                        viewerId,
                        score,
                    })
                    .returning()
                    .run();

                return {
                    message: 'Rating created successfully',
                    success: true,
                    data: {
                        id: newRating.rows[0].id,
                        score,
                        viewer: {
                            id: viewerId
                        }
                    }
                };
            } catch (error) {
                console.error('Error creating rating:', error);
                return {
                    error: 'Failed to create rating',
                    success: false
                };
            }
        },
    }),
};