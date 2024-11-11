import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

const OMDB_API_KEY = import.meta.env.PUBLIC_OMDB_API_KEY;
const OMDB_BASE_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

export const omdb = {
    getOmdbFilm: defineAction({
        input: z.object({
            title: z.string(),
            year: z.string().optional(),
            type: z.enum(['movie', 'series', 'episode']).optional(),
        }),
        handler: async ({ title, year, type }) => {
            try {
                const params = new URLSearchParams();
                params.append('t', title);
                if (year) params.append('y', year);
                if (type) params.append('type', type);

                const response = await fetch(`${OMDB_BASE_URL}&${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const film = await response.json();

                if (film.Response === "False") {
                    return {
                        data: null,
                        error: film.Error || 'Movie not found',
                        searchParams: {
                            title,
                            year,
                            type,
                        }
                    };
                }
                return {
                    data: film,
                    error: null,
                    searchParams: {
                        title,
                        year,
                        type,
                    }
                };
            } catch (error) {
                console.error('Error fetching film:', error);
                return {
                    data: null,
                    error: error instanceof Error ? error.message : 'An unexpected error occurred',
                    searchParams: {
                        title,
                        year,
                        type,
                    }
                };
            }
        },
    }),
};