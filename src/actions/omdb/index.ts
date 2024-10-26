

import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, sql, eq, ViewersDB, RatingsDB, MoviesDB } from 'astro:db';

const OMDB_URL = 'https://www.omdbapi.com/?apikey='

export const omdb = {
    getOmdbFilm: defineAction({
        input: z.object({
            title: z.string(),
            apiKey: z.string(),
        }),
        handler: async ({title, apiKey}) => {
            try {
                const getOMDBFilm = await fetch(`${OMDB_URL}${apiKey}&t=${title}`);
                const film = await getOMDBFilm.json();
                return film;
            } catch (error) {
                console.error('Error fetching film:', error);
            }
        },
    }),

    getManyOMDBFilms: defineAction({
        input: z.object({
            movieQueryParams: z.array(z.object({
                title: z.string(),
                movieId: z.string(),
            })),
            apiKey: z.string(),
        }),
        handler: async ({ 
            movieQueryParams,
            apiKey
        }) => {
            try {
                const films = await Promise.all(movieQueryParams.map(async ({ title, movieId }) => {
                    const response = await fetch(`${OMDB_URL}${apiKey}&t=${encodeURIComponent(title)}`);
                    const film = await response.json();
                    return { ...film, movieId, title };
                }));
                return films;
            } catch (error) {
                console.error('Error fetching films:', error);
            }
        },
    }),
}