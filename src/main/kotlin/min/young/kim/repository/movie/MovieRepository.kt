package min.young.kim.repository.movie

import min.young.kim.model.movie.Movie
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.querydsl.QuerydslPredicateExecutor

// QuerydslPredicateExecutor를 추가로 상속
interface MovieRepository : JpaRepository<Movie, String>, QuerydslPredicateExecutor<Movie>, MovieRepositoryCustom {
    // 사용 가능한 영화만 조회
    fun findAllByIsUsableTrueOrderByReleaseYearAsc(): List<Movie>?

    // 모든 영화 조회 (숨겨진 영화 포함)
    fun findAllByOrderByReleaseYearAsc(): List<Movie>?

    // 기본 제목 검색 메서드 (백업용으로 유지)
    fun findByTitleContainingIgnoreCaseAndIsUsableTrueOrderByReleaseYearAsc(keyword: String): List<Movie>?
    fun findByTitleContainingIgnoreCaseOrderByReleaseYearAsc(keyword: String): List<Movie>?

    @Query(value = """
      select coalesce(max(cast(id as integer)), 0)
      from movie
    """, nativeQuery = true)
    fun findMaxId(): Int
}