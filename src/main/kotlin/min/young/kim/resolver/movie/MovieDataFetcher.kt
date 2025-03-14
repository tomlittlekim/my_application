package min.young.kim.resolver.movie

import com.netflix.graphql.dgs.DgsComponent
import com.netflix.graphql.dgs.DgsMutation
import com.netflix.graphql.dgs.DgsQuery
import com.netflix.graphql.dgs.InputArgument
import min.young.kim.model.movie.Movie
import min.young.kim.repository.movie.MovieRepository

@DgsComponent
class MovieDataFetcher(
    private val movieRepository: MovieRepository,
) {

    @DgsQuery
    fun movies(
        @InputArgument keyword: String = "",
        @InputArgument startYear: Int? = null,
        @InputArgument endYear: Int? = null,
        @InputArgument includeHidden: Boolean = false
    ): List<Movie> {
        // 기존 두 메서드를 통합한 하나의 메서드
        return movieRepository.findMovies(
            keyword = keyword.trim(),
            startYear = startYear,
            endYear = endYear,
            includeHidden = includeHidden
        )
    }

    @DgsQuery
    fun movie(@InputArgument id: String): Movie? = movieRepository.findById(id).orElse(null)

    @DgsMutation
    fun addMovie(@InputArgument title: String, @InputArgument releaseYear: Int): Movie {
        val nextId = movieRepository.findMaxId() + 1
        return movieRepository.save(Movie(nextId.toString(), title, releaseYear));
    }

    @DgsMutation
    fun updateMovie(@InputArgument id: String, @InputArgument title: String?, @InputArgument releaseYear: Int?, @InputArgument isUsable: Boolean): Movie? {
        val movie = movieRepository.findById(id).orElse(null) ?: return null
        title?.let { movie.title = it }
        releaseYear?.let { movie.releaseYear = it }
        movie.isUsable = isUsable
        return movieRepository.save(movie)
    }

    @DgsMutation
    fun deleteMovie(@InputArgument id: String): Movie? {
        if (movieRepository.existsById(id)) {
            val movie = movieRepository.findById(id).orElse(null)
            movie.isUsable = false
            return movieRepository.save(movie)
        } else {
            return null
        }
    }

    @DgsMutation
    fun realDeleteMovie(@InputArgument id: String): Boolean {
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id)
            return true
        }
        return false
    }
}