import { db, Movies, Ratings, Viewers } from 'astro:db';
import { moviesData, ratingsData, viewersData } from './data';

export default async function () {
	await db.insert(Movies).values(moviesData);
	await db.insert(Viewers).values(viewersData)
	await db.insert(Ratings).values(ratingsData)
}


