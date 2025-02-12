package min.young.kim.model.movie

import jakarta.persistence.Entity
import jakarta.persistence.Id

@Entity
data class Movie(
    @Id
    val id: String,
    var title: String,
    var releaseYear: Int,
    var isUsable: Boolean? = true,
)