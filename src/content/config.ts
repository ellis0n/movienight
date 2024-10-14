import { defineCollection, z } from 'astro:content';
import { db, MoviesDB, RatingsDB, ViewersDB } from 'astro:db';

const movies = await db.select().from(MoviesDB);
const ratings = await db.select().from(RatingsDB);
const viewers = await db.select().from(ViewersDB);

const Movies = defineCollection({ 
 loader: async () => {

    const moviesWithRatings = movies.map((movie) => {
      const movieRatings = ratings.filter((rating) => rating.movieId === movie.id);
      const totalRatings = movieRatings.length;
      const average = totalRatings > 0 ? movieRatings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings : 0;

      const ratingsWithViewers = movieRatings.map((rating) => {
        const viewer = viewers.find((viewer) => viewer.id === rating.viewerId);
        return {
          id: rating.id,
          movieId: rating.movieId,
          viewerId: rating.viewerId,
          rating: rating.score,
          viewerName: viewer ? viewer.name : 'Unknown',
        };
      });
      
      return {
        ...movie,
        id: movie.id.toString(),
        totalRatings,
        average,
        ratings: ratingsWithViewers
      };
    });

    return moviesWithRatings;
  },

  schema: z.object({
    id: z.string(),
    title: z.string(),
    date: z.date(),
    average: z.number(),
    totalRatings: z.number(),
    ratings: z.array(z.object({
        id: z.number(),
        movieId: z.number(),
        viewerId: z.number(),
        rating: z.number(),
        viewerName: z.string(),
    })),
  }),
});

const Ratings = defineCollection({
  loader: async () => {
    const ratings = await db.select().from(RatingsDB);
    return ratings.map((rating) => ({
      id: rating.id.toString(),
      movieId: rating.movieId,
      viewerId: rating.viewerId,
      rating: rating.score,
    }));
  },
  schema: z.object({
    id: z.string(),
    movieId: z.number(),
    viewerId: z.number(),
    rating: z.number(),
  }),
});

const Viewers = defineCollection({
  loader: async () => {
    // const viewers = await db.select().from(ViewersDB);
    return viewers.map((viewer) => ({
      id: viewer.id.toString(),
      name: viewer.name,
    }));
  },

  schema: z.object({
    id: z.string(),
    name: z.string(),
  }),
});




export const collections = { Movies, Ratings, Viewers };
