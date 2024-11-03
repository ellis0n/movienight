import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, RatingsDB } from 'astro:db';

export const update = {
    updateScore: defineAction({
        accept: 'form',
        input: z.object({
            score: z.number().min(0).max(10),
            id: z.number(),
        }),
        handler: async ({ score, id }) => { 
            try {
                const ratings = await db.update(RatingsDB)
                    .set({ score })
                    .where(eq(RatingsDB.id, id))
                    .run();

                return {
                    message: 'Rating updated successfully',
                    success: true,
                    score: score
                };
            } catch (error) {
                console.error('Error updating score:', error);
                return {
                    error: 'Failed to update rating',
                    success: false
                };
            }
        },
    }),
};
