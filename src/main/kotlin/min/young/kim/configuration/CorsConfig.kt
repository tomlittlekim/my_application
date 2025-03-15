package min.young.kim.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

/**
 * CORS(Cross-Origin Resource Sharing) 설정
 */
@Configuration
class CorsConfig {

    /**
     * CORS 필터 설정
     */
    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()

        // 허용할 Origin 설정 (여기서는 모든 Origin 허용)
        config.allowedOrigins = listOf("*")

        // 허용할 HTTP 메서드 설정
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")

        // 허용할 헤더 설정
        config.allowedHeaders = listOf("Authorization", "Content-Type", "X-Requested-With")

        // 인증 헤더 노출 설정
        config.exposedHeaders = listOf("Authorization")

        // 모든 경로에 이 설정 적용
        source.registerCorsConfiguration("/**", config)

        return CorsFilter(source)
    }
}