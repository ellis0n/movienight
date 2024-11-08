import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, sql, eq, ViewersDB, RatingsDB, MoviesDB } from 'astro:db';

const OMDB_API_KEY = import.meta.env.PUBLIC_OMDB_API_KEY;

const OMDB_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=`;
const OMDB_IMG_URL = `https://img.omdbapi.com/apikey=${OMDB_API_KEY}`;


export const omdb = {
    getOmdbFilm: defineAction({
        input: z.object({
            title: z.string(),
        }),
        handler: async ({title}) => {
            try {
                const getOMDBFilm = await fetch(`${OMDB_URL}${title}`);
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

    // requires patreon key :(
    getMoviePoster: defineAction({
        input: z.object({
            id: z.string(),
        }),
        handler: async ({id}) => {
            try {
                const getPoster = await fetch(`${OMDB_IMG_URL}i?${id}`);
                console.log(getPoster)
                return {
                    data: poster,
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