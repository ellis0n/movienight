import { db, MoviesDB, RatingsDB, ViewersDB } from 'astro:db';
import { moviesData, ratingsData, viewersData } from './data';

export default async function () {
	await db.insert(MoviesDB).values(moviesData);
	await db.insert(ViewersDB).values(viewersData)
	await db.insert(RatingsDB).values(ratingsData)
}


