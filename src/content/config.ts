import { defineCollection, z } from 'astro:content';
import { db, MoviesDB, RatingsDB, ViewersDB } from 'astro:db';

// Todo: Move to API
const movies = await db.select().from(MoviesDB);
const ratings = await db.select().from(RatingsDB);
const viewers = await db.select().from(ViewersDB);

// Each loader function returns an array of objects that match the schema
// Collections are defined with a loader function and a schema
// We resolve foreign keys and map data to include related data at this level
// We can write APIs to hit the database directly for more complex queries

// ** Movies Collection **
// /movies/[id]
const Movies = defineCollection({ 
 loader: async () => {

    // Map movies to include ratings
    const moviesWithRatings = movies.map((movie) => {
      const movieRatings = ratings.filter((rating) => rating.movieId === movie.id);
      const totalRatings = movieRatings.length;
      const average = totalRatings > 0 ? movieRatings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings : 0;

      // Map ratings to include viewer name
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
      
      // Return movie with ratings
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

  // SCHEMA
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

// ** Ratings Collection **
// /ratings/[id]
const Ratings = defineCollection({
  loader: async () => {
    return ratings.map((rating) => ({
      id: rating.id.toString(),
      movieId: rating.movieId,
      viewerId: rating.viewerId,
      rating: rating.score,
    }));
  },

  // SCHEMA
  schema: z.object({
    id: z.string(),
    movieId: z.number(),
    viewerId: z.number(),
    rating: z.number(),
  }),
});

// ** Viewers Collection **
// /viewers/[id]
const Viewers = defineCollection({
  loader: async () => {

    const viewersWithRatings = viewers.map((viewer) => {
      // Filter ratings for this viewer
      const viewerRatings = ratings.filter((rating) => rating.viewerId === viewer.id);
      // Map ratings to include movie title
      const ratingsWithMovies = viewerRatings.map((rating) => {
        const movie = movies.find((movie) => movie.id === rating.movieId);
        return {
          id: rating.id,
          movieId: rating.movieId,
          movieTitle: movie ? movie.title : 'Unknown',
          score: rating.score,
        };
      });

      return {
        ...viewer,
        id: viewer.id.toString(),
        ratings: ratingsWithMovies,
      };
    });

    return viewersWithRatings;
  },

  // SCHEMA
  schema: z.object({
    id: z.string(),
    name: z.string(),
    clerkId: z.string(),
    ratings: z.array(z.object({
      id: z.number(),
      movieId: z.number(),
      movieTitle: z.string(),
      score: z.number(),
    })),
  }),
});

export const collections = { Movies, Ratings, Viewers };
