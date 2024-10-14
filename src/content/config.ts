import { defineCollection, z } from 'astro:content';
import { db, Movies as MoviesDB, Ratings, Viewers } from 'astro:db';

const Movies = defineCollection({ 
  loader: async () => {
      // Fetch movies from the database
    const movies = await db.select().from(MoviesDB);
    return movies.map((movie) => ({
      id: movie.id.toString(),
      title: movie.title,
      date: movie.date,
      average: movie.average,
    }));
  },

  schema: z.object({
    id: z.string(),
    title: z.string(),
    date: z.date(),
    // optional average
    average: z.number().optional(),
  }),
});

export const collections = { Movies };
