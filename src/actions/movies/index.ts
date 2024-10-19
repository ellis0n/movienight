import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, MoviesDB, RatingsDB, ViewersDB } from 'astro:db';

export const movies = {
    getMovieById: defineAction({
        input: z.object({
            movieId: z.string(),
        }),
        handler: async ({ movieId }) => {
            try {
                const getMovie = await db
                    .select()
                    .from(MoviesDB)
                    .where(eq(MoviesDB.id, Number(movieId)))
                    .run();
                const {...movie } = getMovie.rows[0];
                return movie;
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        },
    }),

    getMovieWithRatings: defineAction({
        input: z.object({
            movieId: z.string(),
            sort: z.string().optional(),
        }),
        handler: async ({ movieId, sort }) => {
            try {
                const getMovie = await db
                    .select()
                    .from(MoviesDB)
                    .where(eq(MoviesDB.id, Number(movieId)))
                    .run();
                const { rows } = getMovie;
                let movieWithRatings = await Promise.all(
                    rows.map(async (movie) => {
                        const ratings = await db
                            .select()
                            .from(RatingsDB)
                            .where(eq(RatingsDB.movieId, Number(movie.id)))
                            .run();
                        return { ...movie, ratings: ratings.rows };
                    })
                );

                await Promise.all(
                    movieWithRatings.map(async (movie) => {
                        await Promise.all(
                            movie.ratings.map(async (rating) => {
                                const viewer = await db
                                    .select()
                                    .from(ViewersDB)
                                    .where(eq(ViewersDB.id, Number(rating.viewerId)))
                                    .run();
                                rating.viewerName = viewer.rows[0].name;
                            })
                        );
                    })
                );


                // sort by total ratings descending
                if (sort == 'TOTAL_RATINGS_DESC') {
                    movieWithRatings.sort((a, b) => b.ratings.length - a.ratings.length);
                }
                return movieWithRatings;
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        },
    }),
}