import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, sql, eq, ViewersDB, RatingsDB, MoviesDB } from 'astro:db';

export const viewers = {

    getViewerById: defineAction({
        input: z.object({
            viewerId: z.string(),
        }),
        handler: async ({ viewerId }) => {
            try {
                const getUser = await db
                    .select()
                    .from(ViewersDB)
                    .where(eq(ViewersDB.id, Number(viewerId))
                    )
                    .run();
                const { ...user } = getUser.rows[0];
                return user;
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        },
    }),

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
                if (sort === 'TOTAL_RATINGS_DESC') {
                    viewersWithRatings.sort((a, b) => b.ratings.length - a.ratings.length);
                }
                return viewersWithRatings;

                
            } catch (error) {
                console.error('Error fetching viewers:', error);
            }
        },
    }),

    getViewerWithRatingsAndMovies: defineAction({
        input: z.object({
            viewerId: z.string(),
            sort: z.string().optional(),
        }),
        handler: async ({ viewerId, sort }) => {
            // we take the viewerId and get the viewer, all the ratings for that viewer
            // then we get all the movies for each rating
            // then we return the viewer with all the ratings and movies
            
            try {
                const viewer = await db
                    .select()
                    .from(ViewersDB)
                    .where(eq(ViewersDB.id, Number(viewerId)))
                    .run();
                const ratings = await db
                    .select()
                    .from(RatingsDB)
                    .where(eq(RatingsDB.viewerId, Number(viewerId)))
                    .run();
                const viewerWithRatings: { ratings: typeof ratings.rows, movies: typeof movies, [key: string]: any } = { ...viewer.rows[0], ratings: ratings.rows, movies: [] };
                const movies = await Promise.all(
                    viewerWithRatings.ratings.map(async (rating) => {
                        const movie = await db
                            .select()
                            .from(MoviesDB)
                            .where(eq(MoviesDB.id, Number(rating.movieId)))
                            .run();
                        return movie.rows[0];
                    })
                );
                viewerWithRatings.movies = movies;
                // sort by total ratings descending
                if (sort === 'TOTAL_RATINGS_DESC') {
                    viewerWithRatings.ratings.sort((a, b) => (Array.isArray(b.ratings) ? b.ratings.length : 0) - (Array.isArray(a.ratings) ? a.ratings.length : 0));
                }
                return viewerWithRatings;
            } catch (error) {
                console.error('Error fetching viewer:', error);
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
