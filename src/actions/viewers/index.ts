import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, sql, eq, ViewersDB, RatingsDB, MoviesDB } from 'astro:db';
import type { ViewerResponse, Rating } from '../../types/viewers';

const PUBLIC_OMDB_API_KEY = import.meta.env.PUBLIC_OMDB_API_KEY;
const OMDB_URL = `https://www.omdbapi.com/?apikey=${PUBLIC_OMDB_API_KEY}`;

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

                if (!getUser.rows[0]) {
                    throw new Error("User not found");
                }

                const user = getUser.rows[0];
                return {
                    id: Number(user.id),
                    _id: String(user._id),
                    name: String(user.name),
                    clerkId: String(user.clerkId),
                    discordId: user.discordId ? String(user.discordId) : undefined,
                    discordUsername: user.discordUsername ? String(user.discordUsername) : undefined,
                    color: String(user.color),
                        avatar: user.avatar ? String(user.avatar) : undefined,
                        isAdmin: Boolean(user.isAdmin),
                        bio: user.bio ? String(user.bio) : undefined,
                        ratings: [],
                        pickedList: []
                };
            } catch (error) {
                console.error('Error fetching user:', error);
                return {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    data: null
                };
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
        handler: async ({ viewerId, sort }) => {
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

                // Get picked movies
                const pickedMovies = await db
                    .select()
                    .from(MoviesDB)
                    .where(eq(MoviesDB.pickedBy, Number(viewerId)))
                    .run();

                // Get all movies for the ratings in a single query
                const movieIds = ratings.rows.map(rating => rating.movieId);
                const movies = await db
                    .select()
                    .from(MoviesDB)
                    .where(sql`${MoviesDB.id} IN ${movieIds}`)
                    .run();

                const movieMap = new Map(movies.rows.map(movie => [movie.id, movie]));

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
                
                const pickedMoviesWithPosters = await Promise.all(pickedMovies.rows.map(async (movie) => {
                    try {
                        const response = await fetch(`${OMDB_URL}&t=${encodeURIComponent(String(movie.title))}`);
                        const omdbData = await response.json();
                        return {
                            id: Number(movie.id),
                            _id: String(movie._id),
                            title: String(movie.title),
                            date: movie.date ? new Date(String(movie.date)) : null,
                            poster: omdbData.Response === 'True' ? omdbData.Poster : null
                        };
                    } catch (error) {
                        console.error(`Error fetching OMDB data for ${movie.title}:`, error);
                        return {
                            id: Number(movie.id),
                            _id: String(movie._id),
                            title: String(movie.title),
                            date: movie.date ? new Date(String(movie.date)) : null,
                            poster: null
                        };
                    }
                }));

                return {
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
                    ratings: ratingsWithMovies,
                    pickedList: pickedMoviesWithPosters
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

                if (!getUser.rows[0]) {
                    return {
                        error: "User not found",
                        data: null
                    };
                }

                const { ...user } = getUser.rows[0];
                return user;
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        },
    }),

    checkAdmin: defineAction({
        input: z.object({
            clerkId: z.string(),
        }),
        handler: async ({ clerkId }): Promise<boolean> => {
            try {
                const viewer = await db
                    .select()
                    .from(ViewersDB)
                    .where(eq(ViewersDB.clerkId, clerkId))
                    .run();
                return Boolean(viewer.rows[0]?.isAdmin);
            } catch (error) {
                console.error('Error checking admin status:', error);
                return false;
            }
        },
    }),
}