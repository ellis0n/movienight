export const movieQueryParams = (movies: any[]) =>
    movies.map((movie) => ({    
        title: String(movie.title),
        movieId: String(movie.id),
    }))
 
    