import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { asc, db, desc, eq, MoviesDB, RatingsDB, sql, ViewersDB } from 'astro:db';

interface MovieWithRatings {
    id: number;
    _id: string;
    title: string;
    date: Date;
    ratings: {
        id: number;
        movieId: number;
        viewerId: number;
        score: number;
        viewerName: string;
    }[];
    average: number;
}

export const movies = {

    getAllMovies: defineAction({
        input: z.object({
            sort: z.string().optional(),
        }),
        handler: async ({ sort }) => {
            try {
                const getMovies = await db
                    .select()
                    .from(MoviesDB)
                    .orderBy(
                        sort === 'TITLE_ASC' ? asc(MoviesDB.title) : desc(MoviesDB.title)
                    )
                    .run();
                const { rows } = getMovies;
                if (sort === 'DATE_DESC') {
                    rows.sort((a, b) => {
                        const dateA = a.date && (typeof a.date === 'string' || typeof a.date === 'number') ? new Date(a.date).getTime() : 0;
                        const dateB = b.date && (typeof b.date === 'string' || typeof b.date === 'number') ? new Date(b.date).getTime() : 0;
                        return dateB - dateA;
                    });
                }
                if (sort === 'DATE_ASC') {
                    rows.sort((a, b) => {
                        const dateA = a.date && (typeof a.date === 'string' || typeof a.date === 'number') ? new Date(a.date).getTime() : 0;
                        const dateB = b.date && (typeof b.date === 'string' || typeof b.date === 'number') ? new Date(b.date).getTime() : 0;
                        return dateA - dateB;
                    });
                }
                return rows;
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
    }),

    getMovieById: defineAction({
        input: z.object({
            movieId: z.number(),
        }),
        handler: async ({ movieId }) => {
            try {
                const getMovie = await db
                    .select()
                    .from(MoviesDB)
                    .where(eq(MoviesDB.id, movieId))
                    .run();
                const { ...movie } = getMovie.rows[0];
                if (!movie) throw new Error('Movie not found');
                return movie;
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        },
    }),

    getMovieWithRatings: defineAction({
        input: z.object({
            movieId: z.number(),
            sort: z.string().optional(),
        }),
        handler: async ({ movieId, sort }): Promise<{ data: MovieWithRatings | null; error: string | null }> => {
            try {
                const getMovie = await db
                    .select()
                    .from(MoviesDB)
                    .where(eq(MoviesDB.id, movieId))
                    .run();
                
                if (!getMovie.rows.length) {
                    return { data: null, error: 'Movie not found' };
                }

                const movie = getMovie.rows[0];
                
                const ratingsQuery = await db
                    .select({
                        id: RatingsDB.id,
                        movieId: RatingsDB.movieId,
                        viewerId: RatingsDB.viewerId,
                        score: RatingsDB.score,
                        viewerName: ViewersDB.name,
                        clerkId: ViewersDB.clerkId
                    })
                    .from(RatingsDB)
                    .where(eq(RatingsDB.movieId, movieId))
                    .innerJoin(ViewersDB, eq(RatingsDB.viewerId, ViewersDB.id))
                    .run();

                const ratings = ratingsQuery.rows;

                const average = ratings.length > 0 
                    ? ratings.reduce((sum, rating) => sum + Number(rating.score), 0) / ratings.length 
                    : 0;

                if (sort === 'RATING_SCORE_DESC') {
                    ratings.sort((a, b) => Number(b.score) - Number(a.score));
                }

                return { 
                    data: { 
                        id: Number(movie.id),
                        _id: String(movie._id),
                        title: String(movie.title),
                        ratings: ratings.map(rating => ({
                            id: Number(rating.id),
                            movieId: Number(rating.movieId),
                            viewerId: Number(rating.viewerId),
                            score: Number(rating.score),
                            viewerName: String(rating.viewerName)
                        })),
                        average,
                        date: movie.date ? new Date(String(movie.date)) : new Date()
                    },
                    error: null
                };
            } catch (error) {
                console.error('Error fetching movie:', error);
                return { data: null, error: 'An error occurred while fetching the movie' };
            }
        },
    }),
}