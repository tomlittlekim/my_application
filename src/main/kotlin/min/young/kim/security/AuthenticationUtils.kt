package min.young.kim.security

import com.netflix.graphql.dgs.context.DgsContext
import graphql.schema.DataFetchingEnvironment
import min.young.kim.model.user.User
import min.young.kim.model.user.UserRole
import min.young.kim.repository.user.UserRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

/**
 * GraphQL 컨텍스트에서 인증 정보를 추출하는 유틸리티 클래스
 */
@Component
class AuthenticationUtils(
    private val userRepository: UserRepository
) {

    /**
     * 현재 인증된 사용자의 ID 반환
     */
    fun getCurrentUserId(): String? {
        val authentication = SecurityContextHolder.getContext().authentication

        if (authentication != null && authentication.isAuthenticated &&
            authentication.principal is org.springframework.security.core.userdetails.User) {
            val userDetails = authentication.principal as org.springframework.security.core.userdetails.User

            // 사용자명으로 사용자 조회
            val user = userRepository.findByUsername(userDetails.username).orElse(null)
            return user?.id
        }

        return null
    }

    /**
     * 현재 인증된 사용자 객체 반환
     */
    fun getCurrentUser(): User? {
        val userId = getCurrentUserId() ?: return null
        return userRepository.findById(userId).orElse(null)
    }

    /**
     * 데이터 페칭 환경에서 현재 인증된 사용자 조회
     */
    fun getCurrentUser(dfe: DataFetchingEnvironment): User? {
        val dgsContext = DgsContext.from(dfe)
        val authentication = SecurityContextHolder.getContext().authentication

        if (authentication != null && authentication.isAuthenticated) {
            val username = authentication.name
            return userRepository.findByUsername(username).orElse(null)
        }

        return null
    }

    /**
     * 사용자가 관리자인지 확인
     */
    fun isAdmin(): Boolean {
        val user = getCurrentUser()
        return user?.role == UserRole.ADMIN
    }

    /**
     * 특정 사용자 ID에 대한 액세스 권한 확인
     * (본인 또는 관리자인 경우에만 접근 허용)
     */
    fun canAccessUser(userId: String): Boolean {
        val currentUser = getCurrentUser()

        return when {
            currentUser == null -> false
            currentUser.role == UserRole.ADMIN -> true
            currentUser.id == userId -> true
            else -> false
        }
    }
}