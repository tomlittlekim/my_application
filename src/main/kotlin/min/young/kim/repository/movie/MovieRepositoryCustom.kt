package min.young.kim.repository.movie

import min.young.kim.model.movie.Movie

interface MovieRepositoryCustom {

    fun findMovies(
        keyword: String = "",
        startYear: Int? = null,
        endYear: Int? = null,
        includeHidden: Boolean = false
    ): List<Movie>

    fun findMaxId(): Int
}