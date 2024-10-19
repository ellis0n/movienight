import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, RatingsDB } from 'astro:db';

export const ratings = {

    getRatingById: defineAction({
        input: z.object({
        ratingId: z.string(),
        }),
        handler: async ({ ratingId }) => {
        try {
            const getRating = await db
            .select()
            .from(RatingsDB)
            .where(eq(RatingsDB.id, Number(ratingId)))
                .run();
            const {...rating } = getRating.rows[0];
            return rating;
        } catch (error) {
            console.error('Error fetching rating:', error);
        }
        },
    }),

    updateScore: defineAction({
        accept: 'form',
        input: z.object({
            score: z.number().min(1).max(10), // Ensure score is within a valid range
            id: z.number(),
        }),
        handler: async ({ score, id }) => { 
        try {
            const ratings = await db.update(RatingsDB)
                .set({ score })
                .where(eq(RatingsDB.id, Number(id)))
                .run();
            return { message: 'Rating updated successfully', success: true };
        } catch (error) {
        console.error('Error updating score:', error);
        }
    },
})};
