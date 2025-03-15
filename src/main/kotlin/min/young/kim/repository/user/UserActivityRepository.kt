package min.young.kim.repository.user

import min.young.kim.model.user.UserActivity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface UserActivityRepository : JpaRepository<UserActivity, String> {
    /**
     * 사용자 ID로 활동 이력 조회 (최신순)
     */
    @Query("SELECT a FROM UserActivity a WHERE a.user.id = :userId ORDER BY a.timestamp DESC")
    fun findByUserIdOrderByTimestampDesc(userId: String): List<UserActivity>

    /**
     * 사용자 ID로 활동 이력 조회 (최신순, 개수 제한)
     */
    @Query("SELECT a FROM UserActivity a WHERE a.user.id = :userId ORDER BY a.timestamp DESC")
    fun findByUserIdOrderByTimestampDesc(userId: String, @Param("limit") limit: Int): List<UserActivity>

    /**
     * 특정 기간 내 사용자 활동 이력 조회
     */
    @Query("SELECT a FROM UserActivity a WHERE a.user.id = :userId AND a.timestamp BETWEEN :startDate AND :endDate ORDER BY a.timestamp DESC")
    fun findByUserIdAndTimestampBetween(
        userId: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ): List<UserActivity>

    /**
     * 특정 활동 타입의 이력 조회
     */
    @Query("SELECT a FROM UserActivity a WHERE a.user.id = :userId AND a.activityType = :activityType ORDER BY a.timestamp DESC")
    fun findByUserIdAndActivityType(
        userId: String,
        activityType: String
    ): List<UserActivity>
}