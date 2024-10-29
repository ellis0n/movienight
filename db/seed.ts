import { db, MoviesDB, RatingsDB, ViewersDB } from 'astro:db';
import { moviesData, ratingsData, viewersData } from './data';

export default async function () {
	// First insert viewers (no foreign key dependencies)
	await db.insert(ViewersDB).values(viewersData);
	
	// Then insert movies (depends on viewers for pickedBy)
	await db.insert(MoviesDB).values(moviesData);
	
	// Finally insert ratings (depends on both movies and viewers)
	await db.insert(RatingsDB).values(ratingsData);
}


