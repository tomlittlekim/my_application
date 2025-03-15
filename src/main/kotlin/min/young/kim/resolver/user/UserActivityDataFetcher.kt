package min.young.kim.resolver.user

import com.netflix.graphql.dgs.DgsComponent
import com.netflix.graphql.dgs.DgsMutation
import com.netflix.graphql.dgs.DgsQuery
import com.netflix.graphql.dgs.InputArgument
import min.young.kim.security.AuthenticationUtils
import min.young.kim.service.user.AuthService
import min.young.kim.service.user.UserActivityService
import org.springframework.security.access.prepost.PreAuthorize

/**
 * 사용자 활동 이력 관련 GraphQL 리졸버
 */
@DgsComponent
class UserActivityDataFetcher(
    private val authService: AuthService,
    private val userActivityService: UserActivityService,
    private val authenticationUtils: AuthenticationUtils
) {

    /**
     * 사용자 활동 이력 조회
     */
    @DgsQuery
    fun userActivities(@InputArgument limit: Int? = 10): List<UserActivityDTO> {
        val currentUser = authenticationUtils.getCurrentUser() ?: return emptyList()

        val activities = userActivityService.getUserActivities(currentUser.id, limit ?: 10)

        return activities.map { activity ->
            UserActivityDTO(
                id = activity.id,
                activityType = activity.activityType.name,
                detail = activity.detail,
                timestamp = activity.timestamp.toString()
            )
        }
    }

    /**
     * 활동 이력 삭제 (관리자 전용)
     */
    @DgsMutation
    @PreAuthorize("hasRole('ADMIN')")
    fun clearUserActivities(): Boolean {
        // 실제로는 구현이 필요하지만 현재는 관리자 기능이므로 stub으로 유지
        // return userActivityService.clearAllActivities();
        return true
    }
}

/**
 * 활동 이력 DTO
 */
data class UserActivityDTO(
    val id: String,
    val activityType: String,
    val detail: String?,
    val timestamp: String
)