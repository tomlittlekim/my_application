package min.young.kim.resolver.movie

import com.netflix.graphql.dgs.DgsComponent
import com.netflix.graphql.dgs.DgsQuery
import com.netflix.graphql.dgs.InputArgument
import min.young.kim.model.movie.Movie

@DgsComponent
class MovieDataFetcher {

    private val movies = listOf(
        Movie("1", "The Shawshank Redemption", 1994),
        Movie("2", "The Godfather", 1972),
        Movie("3", "The Dark Knight", 2008)
    )

    @DgsQuery
    fun allMovies(): List<Movie>? = movies

    @DgsQuery
    fun movie(@InputArgument id: String): Movie? = movies.first { it.id == id }

}