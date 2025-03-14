package min.young.kim.repository.movie

import min.young.kim.model.movie.Movie
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface MovieRepository : JpaRepository<Movie, String> {
    // 사용 가능한 영화만 조회
    fun findAllByIsUsableTrueOrderByReleaseYearAsc(): List<Movie>?

    // 모든 영화 조회 (숨겨진 영화 포함)
    fun findAllByOrderByReleaseYearAsc(): List<Movie>?

    // 기본 제목 검색 메서드 (백업용으로 유지)
    fun findByTitleContainingIgnoreCaseAndIsUsableTrueOrderByReleaseYearAsc(keyword: String): List<Movie>?
    fun findByTitleContainingIgnoreCaseOrderByReleaseYearAsc(keyword: String): List<Movie>?

    // 통합 검색 쿼리 (JPQL 사용)
    @Query("""
        SELECT m FROM Movie m
        WHERE 
            (:keyword = '' OR LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:startYear IS NULL OR m.releaseYear >= :startYear)
            AND (:endYear IS NULL OR m.releaseYear <= :endYear)
            AND (:includeHidden = true OR m.isUsable = true)
        ORDER BY m.releaseYear ASC
    """)
    fun searchMovies(
        keyword: String,
        startYear: Int?,
        endYear: Int?,
        includeHidden: Boolean
    ): List<Movie>?

    @Query(value = """
      select coalesce(max(cast(id as integer)), 0)
      from movie
    """, nativeQuery = true)
    fun findMaxId(): Int
}