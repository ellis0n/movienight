import { db, MoviesDB, RatingsDB, ViewersDB } from 'astro:db';
import { data } from './data/index.ts';

const { movies, ratings, viewers } = data;

export default async function () {

	// Clear the database
	await db.delete(RatingsDB).run();
	await db.delete(MoviesDB).run();
	await db.delete(ViewersDB).run();

	// Viewers first
	await db.insert(ViewersDB).values([...viewers]);

	// Movies next
	await db.insert(MoviesDB).values([...movies]);

	// Ratings last
	await db.insert(RatingsDB).values([...ratings]);

}