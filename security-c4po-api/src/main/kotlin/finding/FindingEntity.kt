package finding

import com.securityc4po.api.BaseEntity
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "findings")
open class FindingEntity(
    data: Finding
) : BaseEntity<Finding>(data)

fun FindingEntity.toFinding(): Finding {
    return finding.Finding(
        this.data.id,
        this.data.severity,
        this.data.title,
        this.data.description,
        this.data.impact,
        this.data.affectedUrls,
        this.data.reproduction,
        this.data.mitigation
    )
}
