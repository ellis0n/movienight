import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, sql, eq, ViewersDB, RatingsDB, MoviesDB } from 'astro:db';

const OMDB_API_KEY = import.meta.env.PUBLIC_OMDB_API_KEY;

const OMDB_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;
const searchTitle = '&t=';


export const omdb = {
    getOmdbFilm: defineAction({
        input: z.object({
            title: z.string(),
        }),
        handler: async ({title}) => {
            try {
                const getOMDBFilm = await fetch(`${OMDB_URL}${searchTitle}${title}`);
                const film = await getOMDBFilm.json();
                return {
                    data: film,
                    error: null
                };
            } catch (error) {
                console.error('Error fetching film:', error);
                return {
                    data: null,
                    error: error
                };
            }
        },
    }),
}