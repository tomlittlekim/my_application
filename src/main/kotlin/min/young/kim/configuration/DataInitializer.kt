package min.young.kim.configuration

import min.young.kim.model.movie.Movie
import min.young.kim.repository.movie.MovieRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class DataInitializer {

    @Bean
    fun init(movieRepository: MovieRepository) = CommandLineRunner {
        movieRepository.saveAll(
            listOf(
                Movie("1", "The Shawshank Redemption", 1994),
                Movie("2", "The Godfather", 1972),
                Movie("3", "The Dark Knight", 2008)
            )
        )
    }
}