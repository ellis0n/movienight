import { db, Movies, Ratings, Viewers } from 'astro:db';
import { moviesData, ratingsData, viewersData } from './data';

export default async function () {

	// // drop tables
	// await db.delete(Movies).run();
	// await db.delete(Ratings).run();
	// await db.delete(Viewers).run();
	
	
  	await db.insert(Movies).values(moviesData);
	  await db.insert(Viewers).values(viewersData)
	  await db.insert(Ratings).values(ratingsData)
}


