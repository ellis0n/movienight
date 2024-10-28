import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, RatingsDB, MoviesDB, ViewersDB } from 'astro:db';
const OMDB_URL = 'https://www.omdbapi.com/?apikey='
const OMDB_IMG_URL = 'https://img.omdbapi.com/?apikey='

export const util = {
    getTheList: defineAction({
        input: z.object({
            currentUserId: z.string().optional(),
        }),
        handler: async ({ currentUserId }) => {
            try {
                const movies = await db.select().from(MoviesDB).run();
                const viewers = await db.select().from(ViewersDB).run();
                const ratings = await db.select().from(RatingsDB).run();

                const viewersMap = new Map(viewers.rows.map(viewer => [viewer.id, {
                    ...viewer,
                    isCurrentUser: viewer.clerkId === currentUserId
                }]));
                
                const ratingsMap = ratings.rows.reduce((acc, rating) => {
                    if (!acc.has(rating.movieId)) {
                        acc.set(rating.movieId, []);
                    }
                    acc.get(rating.movieId).push({
                        ...rating,
                        viewer: viewersMap.get(rating.viewerId)
                    });
                    return acc;
                }, new Map());

                const tableData = movies.rows.map(movie => ({
                    ...movie,
                    ratings: ratingsMap.get(movie.id) || []
                }));

                return { tableData };
            } catch (error) {
                console.error('Error fetching or processing data:', error);
                throw error;
            }
        },
    }),
}
