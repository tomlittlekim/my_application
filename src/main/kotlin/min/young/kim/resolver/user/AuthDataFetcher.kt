package min.young.kim.resolver.user

import com.netflix.graphql.dgs.DgsComponent
import com.netflix.graphql.dgs.DgsMutation
import com.netflix.graphql.dgs.DgsQuery
import com.netflix.graphql.dgs.InputArgument
import min.young.kim.model.user.User
import min.young.kim.security.JwtTokenProvider
import min.young.kim.service.security.TokenBlacklistService
import min.young.kim.service.user.AuthService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes

/**
 * 인증 관련 GraphQL 리졸버
 */
@DgsComponent
class AuthDataFetcher(
    private val authService: AuthService,
    private val tokenBlacklistService: TokenBlacklistService,
    private val jwtTokenProvider: JwtTokenProvider
) {

    /**
     * 현재 로그인한 사용자 정보 조회
     */
    @DgsQuery
    fun currentUser(): User? {
        val authentication = SecurityContextHolder.getContext().authentication
        return authService.getCurrentUser(authentication)
    }

    /**
     * 모든 사용자 조회 (관리자 전용)
     */
    @DgsQuery
    @PreAuthorize("hasRole('ADMIN')")
    fun allUsers(): List<User> {
        return authService.getAllUsers()
    }

    /**
     * 로그인 뮤테이션
     */
    @DgsMutation
    fun login(
        @InputArgument username: String,
        @InputArgument password: String
    ): AuthResponse {
        val result = authService.login(username, password)
        return AuthResponse(
            success = result.success,
            token = result.token,
            message = result.message,
            user = result.user
        )
    }

    /**
     * 로그아웃 뮤테이션 - 토큰 블랙리스트 추가
     */
    @DgsMutation
    fun logout(): LogoutResponse {
        val authentication = SecurityContextHolder.getContext().authentication

        // 요청에서 토큰 추출
        val request = (RequestContextHolder.getRequestAttributes() as? ServletRequestAttributes)?.request
        val authHeader = request?.getHeader("Authorization")

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7) // "Bearer " 이후 부분

            // 토큰 유효성 확인
            if (jwtTokenProvider.validateToken(token)) {
                // 토큰 만료 시간 가져오기
                val expirationTime = jwtTokenProvider.getTokenExpirationTime(token)

                if (expirationTime != null) {
                    // 블랙리스트에 토큰 추가
                    tokenBlacklistService.addToBlacklist(token, expirationTime)

                    // 인증 컨텍스트 클리어
                    SecurityContextHolder.clearContext()

                    return LogoutResponse(
                        success = true,
                        message = "로그아웃되었습니다."
                    )
                }
            }
        }

        // 실패했거나 토큰이 없는 경우에도 로그아웃 성공으로 처리
        SecurityContextHolder.clearContext()
        return LogoutResponse(
            success = true,
            message = "로그아웃되었습니다."
        )
    }

    /**
     * 회원가입 뮤테이션
     */
    @DgsMutation
    fun register(
        @InputArgument username: String,
        @InputArgument email: String,
        @InputArgument password: String
    ): RegisterResponse {
        val result = authService.register(username, email, password)
        return RegisterResponse(
            success = result.success,
            message = result.message,
            user = result.user
        )
    }

    /**
     * 비밀번호 변경 뮤테이션
     */
    @DgsMutation
    fun changePassword(
        @InputArgument oldPassword: String,
        @InputArgument newPassword: String
    ): ChangePasswordResponse {
        val authentication = SecurityContextHolder.getContext().authentication
        val currentUser = authService.getCurrentUser(authentication)

        return if (currentUser != null) {
            val result = authService.changePassword(currentUser.id, oldPassword, newPassword)
            ChangePasswordResponse(
                success = result.success,
                message = result.message
            )
        } else {
            ChangePasswordResponse(
                success = false,
                message = "로그인이 필요합니다."
            )
        }
    }

    /**
     * 사용자 정보 업데이트 뮤테이션
     */
    @DgsMutation
    fun updateUser(
        @InputArgument email: String?
    ): UserUpdateResponse {
        val authentication = SecurityContextHolder.getContext().authentication
        val currentUser = authService.getCurrentUser(authentication)

        return if (currentUser != null) {
            val result = authService.updateUser(currentUser.id, email)
            UserUpdateResponse(
                success = result.success,
                message = result.message,
                user = result.user
            )
        } else {
            UserUpdateResponse(
                success = false,
                message = "로그인이 필요합니다.",
                user = null
            )
        }
    }
}

/**
 * GraphQL 스키마에 맞는 응답 클래스들
 */
data class AuthResponse(
    val success: Boolean,
    val token: String?,
    val message: String?,
    val user: User?
)

data class RegisterResponse(
    val success: Boolean,
    val message: String,
    val user: User?
)

data class LogoutResponse(
    val success: Boolean,
    val message: String
)

data class ChangePasswordResponse(
    val success: Boolean,
    val message: String
)

data class UserUpdateResponse(
    val success: Boolean,
    val message: String,
    val user: User?
)