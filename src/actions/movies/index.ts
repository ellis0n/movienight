import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, MoviesDB } from 'astro:db';

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
}