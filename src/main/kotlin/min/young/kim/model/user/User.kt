package min.young.kim.model.user

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "users")
class User(
    @Id
    var id: String = UUID.randomUUID().toString(),

    @Column(nullable = false, unique = true)
    var username: String,

    @Column(nullable = false, unique = true)
    var email: String,

    @Column(nullable = false)
    var password: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: UserRole = UserRole.USER,

    @Column(nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column
    var lastLoginAt: LocalDateTime? = null
) {
    // 로그인 시간 업데이트 메서드
    fun updateLastLoginTime() {
        this.lastLoginAt = LocalDateTime.now()
    }
}