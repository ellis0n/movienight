import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, eq, RatingsDB, MoviesDB, ViewersDB } from 'astro:db';
const OMDB_URL = 'https://www.omdbapi.com/?apikey='
const OMDB_IMG_URL = 'https://img.omdbapi.com/?apikey='

export const util = {
    getTheList: defineAction({
        input: z.object({
            clerkId: z.string().optional(),
        }),
        handler: async ({ clerkId }) => {
            try {
                const movies = await db.select().from(MoviesDB).run();
                const viewers = await db.select().from(ViewersDB).run();
                const ratings = await db.select().from(RatingsDB).run();

                const viewersMap = new Map(viewers.rows.map(viewer => [viewer.id, {
                    id: viewer.id,
                    name: viewer.name,
                    color: viewer.color,
                    isCurrentUser: viewer.clerkId === clerkId,
                    isAdmin: viewer.isAdmin
                }]));
                
                const ratingsMap = ratings.rows.reduce((acc, rating) => {
                    if (!acc.has(rating.movieId)) {
                        acc.set(rating.movieId, []);
                    }
                    const viewer = viewersMap.get(rating.viewerId);
                    if (viewer) {
                        acc.get(rating.movieId).push({
                            ...rating,
                            viewer
                        });
                    }
                    return acc;
                }, new Map());

                // Fetch OMDB data for each movie
                const moviesWithPosters = await Promise.all(movies.rows.map(async (movie) => {
                    try {
                        const response = await fetch(`${OMDB_URL}${import.meta.env.PUBLIC_OMDB_API_KEY}&t=${encodeURIComponent(movie.title?.toString() ?? '')}`);
                        const omdbData = await response.json();
                        return {
                            id: movie.id,
                            title: movie.title,
                            pickedBy: movie.pickedBy,
                            year: omdbData.Year,
                            runtime: omdbData.Runtime,
                            poster: omdbData.Response === 'True' ? omdbData.Poster : null,
                            date: movie.date
                        };
                    } catch (error) {
                        console.error(`Error fetching OMDB data for ${movie.title}:`, error);
                        return movie;
                    }
                }));
                const tableData = moviesWithPosters.map((movie) => ({
                    id: movie.id,
                    title: movie.title,
                    pickedBy: movie.pickedBy,
                    poster: movie.poster,
                    ratings: ratingsMap.get(movie.id) || [],
                    viewers: Array.from(viewersMap.values()),
                    pickedByName: movie.pickedBy ? viewersMap.get(movie.pickedBy)?.name : null,
                    pickedByColor: movie.pickedBy ? viewersMap.get(movie.pickedBy)?.color : null,
                    date: movie.date
                }));

                return { tableData };
            } catch (error) {
                console.error('Error fetching or processing data:', error);
                throw error;
            }
        },
    }),
}
