package min.young.kim.repository.movie

import min.young.kim.model.movie.Movie
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface MovieRepository : JpaRepository<Movie, String> {
    fun findAllByIsUsableTrue(): List<Movie>?
    fun findByIdAndIsUsableTrue(id: String): Optional<Movie>
}