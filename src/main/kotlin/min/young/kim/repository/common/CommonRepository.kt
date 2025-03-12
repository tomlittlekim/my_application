package min.young.kim.repository.common

import min.young.kim.model.common.Code
import min.young.kim.model.common.CodeId
import org.springframework.data.jpa.repository.JpaRepository

interface CommonRepository : JpaRepository<Code, CodeId> {
    fun findByIdCodeType(codeType: String): List<Code?>?
}