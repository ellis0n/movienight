import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, RatingsDB, MoviesDB, ViewersDB } from 'astro:db';
const OMDB_URL = 'http://www.omdbapi.com/?apikey='
const OMDB_IMG_URL = 'http://img.omdbapi.com/?apikey='

export const util = {
    getTheList: defineAction({
        handler: async () => {
            try {
                // get all movies
                const movies = await db.select().from(MoviesDB).run();

                // get all viewers
                const viewers = await db.select().from(ViewersDB).run();
                // get all ratings
                const ratings = await db.select().from(RatingsDB).run();
                // get all omdb films
                // prepare movie query params for the OMDB request
                const movieListWithRatings = movies.rows.map((movie) => ({
                    ...movie,
                    ratings: ratings.rows.filter((rating) => rating.movieId === movie.id)
                }));

                // match the ratings to the viewers
                const ratingsWithViewers = ratings.rows.map((rating) => ({
                    ...rating,
                    viewer: viewers.rows.find((viewer) => viewer.id === rating.viewerId)
                }));
                // combine the data
                const tableData = movieListWithRatings.map(movie => ({
                    ...movie,
                    ratings: ratingsWithViewers.filter(rating => rating.movieId === movie.id)
                }));

                return { tableData };
            } catch (error) {
                console.error('Error fetching or processing data:', error);
                throw error; // Re-throw the error to be handled by the caller
            }
        },
    }),
}