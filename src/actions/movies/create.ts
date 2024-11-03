import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, MoviesDB } from 'astro:db';

export const create = {

    createMovie: defineAction({
        input: z.object({
            title: z.string(),
            date: z.string().transform((str) => new Date(str)),
            pickedBy: z.number(),
        }),
        handler: async ({ title, date, pickedBy }) => {
            try {
                const allMovies = await db
                    .select()
                    .from(MoviesDB)
                    .run();
                
                if (!allMovies.rows.length) {
                    return {
                        success: false,
                        error: 'No movies found'
                    };
                }
                
                const existingMovie = allMovies.rows.find(m => m.title === title);

                if (existingMovie) {
                    return {
                        success: false,
                        error: 'Movie already exists'
                    };
                }

                const maxId = Math.max(...allMovies.rows.map(m => Number(m.id) ?? 0));
                const newId = maxId + 1;

                const movieData = {
                    title, 
                    date: date.toISOString(), 
                    pickedBy, 
                    _id: crypto.randomUUID(), 
                    id: newId
                };

                await db
                    .insert(MoviesDB)
                    .values({
                        ...movieData,
                        date: date // Use the Date object directly instead of string
                    })
                    .run();

                return {
                    success: true,
                    data: {
                        id: newId,
                        title,
                        date: date.toISOString(),
                        pickedBy
                    }
                };
            } catch (error) {
                console.error('Error creating movie:', error);
                return {
                    success: false,
                    error: String(error)
                };
            }
        },
    }),
};