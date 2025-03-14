package min.young.kim.repository.movie

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import min.young.kim.model.movie.Movie
import min.young.kim.model.movie.QMovie
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class MovieRepositoryCustomImpl(
    private val queryFactory: JPAQueryFactory
) : MovieRepositoryCustom {

    @Transactional(readOnly = true)
    override fun findMovies(
        keyword: String,
        startYear: Int?,
        endYear: Int?,
        includeHidden: Boolean
    ): List<Movie> {
        val movie = QMovie.movie
        val predicates = BooleanBuilder()

        // 검색어 조건 (비어있지 않을 때만)
        if (keyword.isNotBlank()) {
            predicates.and(movie.title.containsIgnoreCase(keyword))
        }

        // 시작 년도 조건
        startYear?.let {
            predicates.and(movie.releaseYear.goe(it))
        }

        // 종료 년도 조건
        endYear?.let {
            predicates.and(movie.releaseYear.loe(it))
        }

        // 숨겨진 영화 포함 여부
        if (!includeHidden) {
            predicates.and(movie.isUsable.isTrue)
        }

        return queryFactory
            .selectFrom(movie)
            .where(predicates)
            .orderBy(movie.releaseYear.asc())
            .fetch()
    }

    @Transactional(readOnly = true)
    override fun findMaxId(): Int {
        val movie = QMovie.movie

        // ID 필드의 최대값 조회
        val maxId = queryFactory
            .select(movie.id.max())
            .from(movie)
            .fetchOne() ?: "0"

        return maxId.toIntOrNull() ?: 0
    }
}