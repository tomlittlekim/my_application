package min.young.kim.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtTokenProvider: JwtTokenProvider,
    private val userDetailsService: CustomUserDetailsService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            // 요청에서 JWT 토큰 추출
            val jwt = getJwtFromRequest(request)

            // 토큰이 유효한 경우 인증 정보 설정
            if (jwt != null && StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                val userId = jwtTokenProvider.getUserIdFromToken(jwt)

                // 사용자 ID가 null이 아닌 경우에만 UserDetails 로드
                userId?.let {
                    // 사용자 ID로 UserDetails 로드
                    val userDetails = userDetailsService.loadUserById(it)

                    // 인증 객체 생성 및 SecurityContext에 설정
                    val authentication = jwtTokenProvider.getAuthentication(jwt, userDetails)
                    SecurityContextHolder.getContext().authentication = authentication
                }
            }
        } catch (ex: Exception) {
            logger.error("Could not set user authentication in security context", ex)
        }

        filterChain.doFilter(request, response)
    }

    /**
     * Authorization 헤더에서 JWT 토큰 추출
     */
    private fun getJwtFromRequest(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7)
        }

        return null
    }
}