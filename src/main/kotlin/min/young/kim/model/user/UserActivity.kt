package min.young.kim.model.user

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

/**
 * 사용자 활동 이력 모델
 */
@Entity
@Table(name = "user_activities")
class UserActivity(
    @Id
    val id: String = UUID.randomUUID().toString(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val activityType: ActivityType,

    @Column
    val detail: String? = null,

    @Column(nullable = false)
    val timestamp: LocalDateTime = LocalDateTime.now()
)

/**
 * 활동 타입 열거형
 */
enum class ActivityType {
    LOGIN,           // 로그인
    LOGOUT,          // 로그아웃
    PROFILE_UPDATE,  // 프로필 정보 수정
    PASSWORD_CHANGE, // 비밀번호 변경
    CONTENT_ADD,     // 콘텐츠 추가 (영화 등)
    CONTENT_EDIT,    // 콘텐츠 수정
    CONTENT_DELETE   // 콘텐츠 삭제
}