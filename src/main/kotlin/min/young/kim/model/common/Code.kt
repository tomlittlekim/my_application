package min.young.kim.model.common

import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import java.io.Serializable

@Entity
data class Code(
    @EmbeddedId
    val id: CodeId,
    val displayValue: String,
)

@Embeddable
data class CodeId(
    val code: String = "",
    val codeType: String = ""
) : Serializable