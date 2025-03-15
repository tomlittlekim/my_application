package min.young.kim.configuration

import min.young.kim.service.security.TokenBlacklistService
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled

@Configuration
@EnableScheduling
class SchedulingConfig(
    private val tokenBlacklistService: TokenBlacklistService
) {

    /**
     * 1시간마다 만료된 토큰 블랙리스트 정리
     */
    @Scheduled(fixedRate = 3600000) // 1시간(밀리초)
    fun cleanupExpiredTokens() {
        tokenBlacklistService.cleanupExpiredTokens()
    }
}