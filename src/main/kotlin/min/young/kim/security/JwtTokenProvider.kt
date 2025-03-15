package min.young.kim.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import min.young.kim.model.user.User
import min.young.kim.service.security.TokenBlacklistService
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value("\${jwt.secret}")
    private val secretString: String,

    @Value("\${jwt.expiration}")
    private val expirationTime: Long,

    private val tokenBlacklistService: TokenBlacklistService
) {

    // 비밀키 생성
    private val secretKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(secretString.toByteArray(StandardCharsets.UTF_8))
    }

    /**
     * 사용자 정보를 기반으로 JWT 토큰 생성
     */
    fun generateToken(user: User): String {
        val claims: Claims = Jwts.claims().setSubject(user.id)
        claims["username"] = user.username
        claims["role"] = user.role.name

        val now = Date()
        val expiryDate = Date(now.time + expirationTime)

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact()
    }

    /**
     * 토큰에서 사용자 ID 추출
     * 이 함수는 유효하지 않은 토큰이나 만료된 토큰의 경우 null을 반환합니다.
     */
    fun getUserIdFromToken(token: String): String? {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .body
                .subject
        } catch (e: Exception) {
            null
        }
    }

    /**
     * 토큰에서 Claims 추출
     */
    fun getClaimsFromToken(token: String): Claims? {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .body
        } catch (e: Exception) {
            null
        }
    }

    /**
     * 토큰 유효성 검증
     */
    fun validateToken(token: String): Boolean {
        // 블랙리스트 확인
        if (tokenBlacklistService.isBlacklisted(token)) {
            return false
        }

        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)

            !claims.body.expiration.before(Date())
        } catch (e: Exception) {
            false
        }
    }

    /**
     * 토큰의 만료 시간을 Instant로 반환
     */
    fun getTokenExpirationTime(token: String): Instant? {
        return try {
            val claims = getClaimsFromToken(token)
            claims?.expiration?.toInstant()
        } catch (e: Exception) {
            null
        }
    }

    /**
     * 토큰으로부터 Authentication 객체 생성
     */
    fun getAuthentication(token: String, userDetails: UserDetails): Authentication {
        val claims = getClaimsFromToken(token)
        val authorities = listOf(SimpleGrantedAuthority("ROLE_${claims!!["role"]}"))

        return UsernamePasswordAuthenticationToken(
            userDetails,
            "",
            authorities
        )
    }
}