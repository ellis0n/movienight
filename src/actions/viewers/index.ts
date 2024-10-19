import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, sql, eq, ViewersDB, RatingsDB, MoviesDB } from 'astro:db';

export const viewers = {

    getAllViewers: defineAction({
        handler: async () => {
            try {
                const getAllViewers = await db
                    .select()
                    .from(ViewersDB)
                    .run();
                const { rows } = getAllViewers;
                return rows;
            } catch (error) {
                console.error('Error fetching viewers:', error);
            }
        },
    }),

    //TODO: Returning type errors, no viewers found
    getAllViewersWithRatings: defineAction({
        input: z.object({
            sort: z.string().optional(),
        }),
        handler: async ({sort}) => {
            try {
                const getAllViewers = await db
                    .select()
                    .from(ViewersDB)
                    .run();
                const { rows } = getAllViewers;
                const viewersWithRatings = await Promise.all(
                    rows.map(async (viewer) => {
                        const ratings = await db
                            .select()
                            .from(RatingsDB)
                            .where(eq(RatingsDB.viewerId, Number(viewer.id)))
                            .run();
                        return { ...viewer, ratings: ratings.rows };
                    })
                );
                // sort by total ratings descending
                // TODO: enum?
                if (sort === 'TOTAL_RATINGS_DESC') {
                    viewersWithRatings.sort((a, b) => b.ratings.length - a.ratings.length);
                }
                return viewersWithRatings;

                
            } catch (error) {
                console.error('Error fetching viewers:', error);
            }
        },
    }),

    getViewerByClerkId: defineAction({
        input: z.object({
            clerkId: z.string(),
        }),
        handler: async ({ clerkId }) => {
            try {
                const getUser = await db
                    .select()
                    .from(ViewersDB)
                    .where(eq(ViewersDB.clerkId, clerkId))
                    .run();
                const { ...user } = getUser.rows[0];
                return user;
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        },
    }),
}
