package min.young.kim.service.user

import min.young.kim.model.user.ActivityType
import min.young.kim.model.user.User
import min.young.kim.model.user.UserActivity
import min.young.kim.repository.user.UserActivityRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

/**
 * 사용자 활동 이력 관리 서비스
 */
@Service
class UserActivityService(
    private val userActivityRepository: UserActivityRepository
) {

    /**
     * 활동 이력 기록
     */
    @Transactional
    fun recordActivity(user: User, type: ActivityType, detail: String? = null) {
        val activity = UserActivity(
            user = user,
            activityType = type,
            detail = detail,
            timestamp = LocalDateTime.now()
        )

        userActivityRepository.save(activity)
    }

    /**
     * 사용자의 최근 활동 이력 조회
     */
    fun getUserActivities(userId: String, limit: Int = 10): List<UserActivity> {
        return userActivityRepository.findByUserIdOrderByTimestampDesc(userId, limit)
    }

    /**
     * 로그인 활동 기록
     */
    @Transactional
    fun recordLogin(user: User) {
        recordActivity(user, ActivityType.LOGIN)
    }

    /**
     * 로그아웃 활동 기록
     */
    @Transactional
    fun recordLogout(user: User) {
        recordActivity(user, ActivityType.LOGOUT)
    }

    /**
     * 비밀번호 변경 활동 기록
     */
    @Transactional
    fun recordPasswordChange(user: User) {
        recordActivity(user, ActivityType.PASSWORD_CHANGE)
    }

    /**
     * 프로필 업데이트 활동 기록
     */
    @Transactional
    fun recordProfileUpdate(user: User, field: String) {
        recordActivity(user, ActivityType.PROFILE_UPDATE, "필드 수정: $field")
    }

    /**
     * 콘텐츠 추가 활동 기록
     */
    @Transactional
    fun recordContentAdd(user: User, contentType: String, contentName: String) {
        recordActivity(user, ActivityType.CONTENT_ADD, "$contentType 추가: $contentName")
    }

    /**
     * 콘텐츠 수정 활동 기록
     */
    @Transactional
    fun recordContentEdit(user: User, contentType: String, contentName: String) {
        recordActivity(user, ActivityType.CONTENT_EDIT, "$contentType 수정: $contentName")
    }
}