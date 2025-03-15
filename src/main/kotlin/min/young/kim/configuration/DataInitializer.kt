package min.young.kim.configuration

import min.young.kim.model.common.Code
import min.young.kim.model.common.CodeId
import min.young.kim.model.movie.Movie
import min.young.kim.model.user.User
import min.young.kim.model.user.UserRole
import min.young.kim.repository.common.CommonRepository
import min.young.kim.repository.movie.MovieRepository
import min.young.kim.repository.user.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class DataInitializer {

    @Bean
    fun initMovies(movieRepository: MovieRepository) = CommandLineRunner {
        movieRepository.saveAll(
            listOf(
                Movie("1", "The Shawshank Redemption", 1994),
                Movie("2", "The Godfather", 1972),
                Movie("3", "The Dark Knight", 2008)
            )
        )
    }

    @Bean
    fun initCodes(commonRepository: CommonRepository) = CommandLineRunner {
        commonRepository.saveAll(
            listOf(
                Code(CodeId("Y", "IS_USABLE"), "예"),
                Code(CodeId("N", "IS_USABLE"), "아니오")
            )
        )
    }

    @Bean
    fun initUsers(userRepository: UserRepository, passwordEncoder: PasswordEncoder) = CommandLineRunner {
        // 기본 관리자 계정 생성
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(
                User(
                    username = "admin",
                    email = "admin@example.com",
                    password = passwordEncoder.encode("admin1234"),
                    role = UserRole.ADMIN
                )
            )
        }

        // 기본 사용자 계정 생성
        if (!userRepository.existsByUsername("user")) {
            userRepository.save(
                User(
                    username = "user",
                    email = "user@example.com",
                    password = passwordEncoder.encode("user1234"),
                    role = UserRole.USER
                )
            )
        }
    }
}