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
    override fun searchMoviesWithQueryDsl(
        keyword: String,
        startYear: Int?,
        endYear: Int?,
        includeHidden: Boolean
    ): List<Movie> {
        val movie = QMovie.movie
        val predicates = BooleanBuilder()

        // 검색어 조건
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
}