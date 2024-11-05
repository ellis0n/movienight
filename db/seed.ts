import { db, MoviesDB, RatingsDB, ViewersDB } from 'astro:db';
import { moviesData, ratingsData, viewersData, fetchOmdbData } from './data';
import { omdb } from 'src/actions/omdb';


export default async function () {

	// Clear the database
	await db.delete(RatingsDB).run();
	await db.delete(MoviesDB).run();
	await db.delete(ViewersDB).run();

	// Viewers first
	await db.insert(ViewersDB).values(viewersData);

	// Populate OMDB data 
	// TODO: Add OMDB to seed data and remove. OMDB should be fetched when adding movie to db.
	const moviesWithOmdb = await Promise.all(moviesData.map(async (movie) => {
		const omdb = await fetchOmdbData(movie.title);
		return { ...movie, omdb };
	}));

	
	await db.insert(MoviesDB).values(moviesWithOmdb);
	
	await db.insert(RatingsDB).values(ratingsData);

}


