

import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, sql, eq, ViewersDB, RatingsDB, MoviesDB } from 'astro:db';

const OMDB_URL = 'http://www.omdbapi.com/?apikey='
const OMDB_IMG_URL = 'http://img.omdbapi.com/?apikey='

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
}