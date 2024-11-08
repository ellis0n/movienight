import { movies } from './movies';
import { ratings } from './ratings';
import { viewers } from './viewers';

export const validateData = () => {
    const viewerIds = new Set(viewers.map(v => v.id));
    const movieIds = new Set(movies.map(m => m.id));

    // Validate pickedBy in movies
    const invalidMovies = movies.filter(m => !viewerIds.has(m.pickedBy));
    if (invalidMovies.length > 0) {
        console.error('Invalid pickedBy references:', invalidMovies);
    }

    // Validate movieId and viewerId in ratings
    const invalidRatings = ratings.filter(r =>
        !movieIds.has(r.movieId) || !viewerIds.has(r.viewerId)
    );
    if (invalidRatings.length > 0) {
        console.error('Invalid rating references:', invalidRatings);
    }

    // Warn if no admin
    const checkForAdmin = viewers.filter(v => v.isAdmin);
    if (checkForAdmin.length === 0) {
        console.warn('No admin found');
    }
}

export const data = {
    movies,
    ratings,
    viewers
}