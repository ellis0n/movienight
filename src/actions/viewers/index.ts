import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, sql, eq, ViewersDB, RatingsDB, MoviesDB } from 'astro:db';
import type { ViewerResponse, Rating } from '../../types/viewers';

export const viewers = {

    getViewerById: defineAction({
        input: z.object({
            viewerId: z.number(),
        }),
        handler: async ({ viewerId }) => {
            try {
                const getUser = await db
                    .select()
                    .from(ViewersDB)
                    .where(eq(ViewersDB.id, Number(viewerId))
                    )
                    .run();
                const user = getUser.rows[0];
                if (!user) throw new Error('User not found');
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
            viewerId: z.number(),
            sort: z.string().optional(),
        }),
        handler: async ({ viewerId, sort }): Promise<ViewerResponse> => {
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

                // Get all movies for the ratings in a single query
                const movieIds = ratings.rows.map(rating => rating.movieId);
                const movies = await db
                    .select()
                    .from(MoviesDB)
                    .where(sql`${MoviesDB.id} IN ${movieIds}`)
                    .run();

                // Create a map of movies for easier lookup
                const movieMap = new Map(movies.rows.map(movie => [movie.id, movie]));

                // Combine ratings with movie data
                const ratingsWithMovies: Rating[] = ratings.rows.map(rating => {
                    const movie = movieMap.get(rating.movieId);
                    return {
                        id: Number(rating.id),
                        _id: String(rating._id),
                        movieId: Number(rating.movieId),
                        viewerId: Number(viewerId),
                        score: Number(rating.score),
                        movieTitle: String(movie?.title || 'Unknown Movie'),
                        date: movie?.date ? new Date(String(movie.date)) : null,
                        clerkId: String(viewer.rows[0].clerkId),
                    };
                });

                if (sort === 'RATING_SCORE_DESC') {
                    ratingsWithMovies.sort((a, b) => Number(b.score) - Number(a.score));
                }

                if (!viewer.rows[0]) throw new Error('Viewer not found');
                
                return {
                    data: {
                        data: {
                            id: Number(viewer.rows[0].id),
                            _id: String(viewer.rows[0]._id),
                            name: String(viewer.rows[0].name),
                            clerkId: String(viewer.rows[0].clerkId),
                            discordId: String(viewer.rows[0].discordId ?? null),
                            discordUsername: String(viewer.rows[0].discordUsername ?? null),
                            color: String(viewer.rows[0].color),
                            avatar: String(viewer.rows[0].avatar ?? ''),
                            isAdmin: Boolean(viewer.rows[0].isAdmin),
                            bio: String(viewer.rows[0].bio) ?? undefined,
                            ratings: ratingsWithMovies
                        },
                        error: null
                    }
                };
            } catch (error) {
                return {
                    data: {
                        data: null,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                };
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
