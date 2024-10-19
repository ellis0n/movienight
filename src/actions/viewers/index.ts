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

                let viewersQuery = db
                    .select({
                        viewerId: ViewersDB.id,
                        viewerName: ViewersDB.name,
                        ratingCount: sql`COUNT(${RatingsDB.id})`,
                    })
                    .from(ViewersDB)
                    .leftJoin(RatingsDB, eq(ViewersDB.id, RatingsDB.viewerId))
                .groupBy(ViewersDB.id)
                .orderBy(sort === 'TOTAL_RATINGS_DESC' ? sql`COUNT(${RatingsDB.id}) DESC` : sql`COUNT(${RatingsDB.id}) ASC`);


                const {
                    rows: viewersWithRatings
                } = await viewersQuery.run();

                 // Fetch ratings for each viewer
                await Promise.all(
                    viewersWithRatings.map(async (viewer) => {
                        const ratings = await db
                            .select()
                            .from(RatingsDB)
                            .where(eq(RatingsDB.viewerId, Number(viewer.viewerId)))
                            .run();
                    })
                    
                );
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
