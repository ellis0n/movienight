import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, RatingsDB } from 'astro:db';
import { create } from './create';
import { update } from './update';

export const ratings = {

    getViewerRatings: defineAction({
        input: z.object({
        viewerId: z.number(),
        }),
        handler: async ({ viewerId }) => {
            try {
                const getAllRatings = await db
                .select()
                .from(RatingsDB)
                .where(eq(RatingsDB.viewerId, Number(viewerId)))
                .run();
                const { rows } = getAllRatings;
                return {rows, count: rows.length};
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        },
    }),

    getAllRatingsForMovie: defineAction({
        input: z.object({
        movieId: z.number(),
        }),
        handler: async ({ movieId }) => {
        try {
            const getAllRatings = await db
            .select()
            .from(RatingsDB)
            .where(eq(RatingsDB.movieId, Number(movieId)))
            .run();
            const { rows } = getAllRatings;
            return {rows, count: rows.length};
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
        },
    }),


    getRatingById: defineAction({
        input: z.object({
            ratingId: z.number(),
        }),
        handler: async ({ ratingId }) => {
        try {
            const getRating = await db
            .select()
            .from(RatingsDB)
            .where(eq(RatingsDB.id, ratingId))
                .run();
            const rating = getRating.rows[0];
            if (!rating) throw new Error('Rating not found');
            return rating;
        } catch (error) {
            console.error('Error fetching rating:', error);
        }
        },
    }), 
    ...create,
    ...update,
};