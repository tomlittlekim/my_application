package min.young.kim.repository.movie

import min.young.kim.model.movie.Movie
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface MovieRepository : JpaRepository<Movie, String> {
    fun findAllByIsUsableTrue(): List<Movie>?
    fun findByIdAndIsUsableTrue(id: String): Optional<Movie>

    @Query(value = """
      select coalesce(max(cast(id as integer)), 0)
      from movie
    """, nativeQuery = true)
    fun findMaxId(): Int
}