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
            currentClerkId: z.string().optional(),
        }),
        handler: async ({ viewerId, currentClerkId }): Promise<ViewerResponse> => {
            try {
                const getUser = await db
                    .select()
                    .from(ViewersDB)
                    .where(eq(ViewersDB.id, Number(viewerId)))
                    .run();

                if (!getUser.rows[0]) {
                    return {
                        viewer: null,
                        isAdmin: false,
                        error: "Viewer not found"
                    };
                }

                const viewer = getUser.rows[0];
                const isCurrentViewer = currentClerkId ? viewer.clerkId === currentClerkId : false;

                return {
                    viewer: {
                        id: Number(viewer.id),
                        _id: String(viewer._id),
                        name: String(viewer.name),
                        clerkId: String(viewer.clerkId),
                        discordId: viewer.discordId ? String(viewer.discordId) : undefined,
                        discordUsername: viewer.discordUsername ? String(viewer.discordUsername) : undefined,
                        color: String(viewer.color),
                        avatar: viewer.avatar ? String(viewer.avatar) : undefined,
                        isAdmin: Boolean(viewer.isAdmin),
                        bio: viewer.bio ? String(viewer.bio) : undefined,
                        isCurrentViewer,
                        ratings: [],
                        pickedList: []
                    },
                    isAdmin: Boolean(viewer.isAdmin),
                    error: null
                };
            } catch (error) {
                console.error('Error fetching viewer:', error);
                return {
                    viewer: null,
                    isAdmin: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
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

    getAllViewersWithRatingsCount: defineAction({
        handler: async () => {
            try {
                const getAllViewers = await db
                    .select()
                    .from(ViewersDB)
                    .run();

                const { rows } = getAllViewers;
                const viewersWithRatingCount = await Promise.all(
                    rows.map(async (viewer) => {
                        const ratings = await db
                            .select()
                            .from(RatingsDB)
                            .where(eq(RatingsDB.viewerId, Number(viewer.id)))
                            .run();
                        return {
                            id: Number(viewer.id),
                            _id: String(viewer._id),
                            name: String(viewer.name),
                            clerkId: viewer.clerkId ? String(viewer.clerkId) : null,
                            discordId: viewer.discordId ? String(viewer.discordId) : undefined,
                            discordUsername: viewer.discordUsername ? String(viewer.discordUsername) : undefined,
                            color: String(viewer.color),
                            avatar: viewer.avatar ? String(viewer.avatar) : undefined,
                            isAdmin: Boolean(viewer.isAdmin),
                            bio: viewer.bio ? String(viewer.bio) : undefined,
                            totalRatings: ratings.rows.length
                        };
                    })
                );
                viewersWithRatingCount.sort((a, b) => b.totalRatings - a.totalRatings);
                return viewersWithRatingCount;
            } catch (error) {
                console.error('Error fetching viewers:', error);
                return [];
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

                const ratingsWithMovies: Rating[] = await Promise.all(ratings.rows.map(async rating => {
                    const movie = movieMap.get(rating.movieId);
                    let omdbData = null;
                    
                    if (movie) {
                        try {
                            const response = await fetch(`${OMDB_URL}&t=${encodeURIComponent(String(movie.title))}`);
                            omdbData = await response.json();
                        } catch (error) {
                            console.error(`Error fetching OMDB data for ${movie.title}:`, error);
                        }
                    }

                    return {
                        id: Number(rating.id),
                        _id: String(rating._id),
                        movieId: Number(rating.movieId),
                        viewerId: Number(viewerId),
                        score: Number(rating.score),
                        movieTitle: String(movie?.title || 'Unknown Movie'),
                        date: movie?.date ? new Date(String(movie.date)) : null,
                        clerkId: String(viewer.rows[0].clerkId),
                        year: omdbData?.Year,
                        runtime: omdbData?.Runtime,
                        poster: omdbData?.Poster
                    };
                }));

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
}