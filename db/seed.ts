import { db, Movies, Ratings } from 'astro:db';
import { moviesData, ratingsData } from './data';

export default async function() {
  await db.insert(Movies).values(moviesData);
  await db.insert(Ratings).values(ratingsData)
}


