package min.young.kim.repository.movie

import min.young.kim.model.movie.Movie

interface MovieRepositoryCustom {
    fun searchMoviesWithQueryDsl(
        keyword: String,
        startYear: Int?,
        endYear: Int?,
        includeHidden: Boolean
    ): List<Movie>
}