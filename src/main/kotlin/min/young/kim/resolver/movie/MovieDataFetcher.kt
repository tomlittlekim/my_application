package min.young.kim.resolver.movie

import com.netflix.graphql.dgs.DgsComponent
import com.netflix.graphql.dgs.DgsQuery
import com.netflix.graphql.dgs.InputArgument
import min.young.kim.model.movie.Movie
import min.young.kim.repository.movie.MovieRepository

@DgsComponent
class MovieDataFetcher(
    private val movieRepository: MovieRepository,
) {

    @DgsQuery
    fun allMovies(): List<Movie>? = movieRepository.findAll()

    @DgsQuery
    fun movie(@InputArgument id: String): Movie? = movieRepository.findById(id).orElse(null)

}