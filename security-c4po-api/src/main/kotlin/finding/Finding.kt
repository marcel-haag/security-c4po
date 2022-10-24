package finding

import org.springframework.data.mongodb.core.index.Indexed
import java.util.*

data class Finding (
    @Indexed(background = true, unique = true)
    val id: String = UUID.randomUUID().toString(),
    val severity: Severity,
    val title: String,
    val description: String,
    val impact: String,
    val affectedUrls: List<String>? = emptyList(),
    val reproduction: String,
    val mitigation: String
)
