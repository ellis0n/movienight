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

                const parseJson = (json: string) => {
                    try {
                        return JSON.parse(json);
                    } catch (error) {
                        return null;
                    }
                }

                const tableData = movies.rows.map((movie) => {
                   

                    return {
                        id: movie.id,
                        title: movie.title,
                        pickedBy: movie.pickedBy,
                        poster: movie.omdb ? parseJson(movie.omdb as string)?.Poster : null,
                        ratings: ratingsMap.get(movie.id) || [],
                        viewers: Array.from(viewersMap.values()),
                        pickedByName: movie.pickedBy ? viewersMap.get(movie.pickedBy)?.name : null,
                        pickedByColor: movie.pickedBy ? viewersMap.get(movie.pickedBy)?.color : null,
                        date: movie.date
                    };
                });

                return { tableData };
            } catch (error) {
                console.error('Error fetching or processing data:', error);
                throw error;
            }
        },
    }),
}
