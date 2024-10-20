import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { asc, db, desc, eq, MoviesDB, RatingsDB, sql, ViewersDB } from 'astro:db';

interface Row {
    [key: string]: any;
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
                return rows;
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
    }),

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
                            .orderBy(
                                desc(RatingsDB.score)
                            )
                            .run();
                        
                        if (sort === 'RATING_SCORE_DESC') {
                        }

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


                // sort by rating score descending
                // if (sort == 'RATING_SCORE_DESC') {
                //      movieWithRatings = movieWithRatings.map((movie) => {
                //         movie.ratings.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
                //     return movie;
                // });
                // }
                return movieWithRatings;
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        },
    }),
}