// TokenBlacklistService.kt
package min.young.kim.service.security

import org.springframework.stereotype.Service
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

/**
 * 토큰 블랙리스트 관리 서비스
 */
@Service
class TokenBlacklistService {
    // 메모리 기반 블랙리스트 저장소 (토큰 -> 만료시간)
    private val blacklistedTokens = ConcurrentHashMap<String, Instant>()

    /**
     * 토큰 블랙리스트에 추가
     */
    fun addToBlacklist(token: String, expirationTime: Instant) {
        blacklistedTokens[token] = expirationTime
    }

    /**
     * 토큰이 블랙리스트에 있는지 확인
     */
    fun isBlacklisted(token: String): Boolean {
        return blacklistedTokens.containsKey(token)
    }

    /**
     * 만료된 토큰 정리 (주기적으로 호출 필요)
     */
    fun cleanupExpiredTokens() {
        val now = Instant.now()
        blacklistedTokens.entries.removeIf { entry -> entry.value.isBefore(now) }
    }
}