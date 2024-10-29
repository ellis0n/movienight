import { db, MoviesDB, RatingsDB, ViewersDB } from 'astro:db';
import { moviesData, ratingsData, viewersData } from './data';

export default async function () {

	// Clear the database
	await db.delete(RatingsDB).run();
	await db.delete(MoviesDB).run();
	await db.delete(ViewersDB).run();

	await db.insert(ViewersDB).values(viewersData);
	
	await db.insert(MoviesDB).values(moviesData);
	
	await db.insert(RatingsDB).values(ratingsData);
}


