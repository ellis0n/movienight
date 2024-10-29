import type { APIRoute } from 'astro';
const OMDB_URL = 'http://www.omdbapi.com/?apikey='
const OMDB_API_KEY = import.meta.env.PUBLIC_OMDB_API_KEY as string;


export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  const title = url.searchParams.get('title');

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }


  try {
    const response = await fetch(`${OMDB_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`);
    const data = await response.json();

    if (data.Response === 'False') {
      return new Response(JSON.stringify({ error: data.Error }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ posterUrl: data.Poster }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching movie poster:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch poster' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
