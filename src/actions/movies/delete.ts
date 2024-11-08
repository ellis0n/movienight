import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, MoviesDB, RatingsDB } from 'astro:db';


deleteMovie: defineAction({
    input: z.object({
        movieId: z.number(),
    }),
    handler: async ({ movieId }) => {
        try {
            // First delete associated ratings
            await db
                .delete(RatingsDB)
                .where(eq(RatingsDB.movieId, movieId))
                .run();
            
            // Then delete the movie
            const deleteResult = await db
                .delete(MoviesDB)
                .where(eq(MoviesDB.id, movieId))
                .run();

            return {
                success: true,
                data: deleteResult
            };
        } catch (error) {
            console.error('Error deleting movie:', error);
            return {
                success: false,
                error: String(error)
            };
        }
    }
})