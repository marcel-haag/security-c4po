package com.securityc4po.api.finding

import com.securityc4po.api.ResponseBody
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
    val mitigation: String?
)

fun buildFinding(body: FindingRequestBody, findingEntity: FindingEntity): Finding {
    return Finding(
        id = findingEntity.data.id,
        severity = Severity.valueOf(body.severity),
        title = body.title,
        description = body.description,
        impact = body.impact,
        affectedUrls = body.affectedUrls,
        reproduction = body.reproduction,
        mitigation = body.mitigation
    )
}

data class FindingRequestBody(
    val severity: String,
    val title: String,
    val description: String,
    val impact: String,
    val affectedUrls: List<String>? = emptyList(),
    val reproduction: String,
    val mitigation: String?
)

fun Finding.toFindingResponseBody(): ResponseBody {
    return mapOf(
        "id" to id,
        "severity" to severity,
        "title" to title,
        "description" to description,
        "impact" to impact,
        "affectedUrls" to affectedUrls,
        "reproduction" to reproduction,
        "mitigation" to mitigation
    )
}

fun Finding.toFindingDeleteResponseBody(): ResponseBody {
    return mapOf(
        "id" to id
    )
}

/**
 * Validates if a [FindingRequestBody] is valid
 *
 * @return Boolean describing if the body is valid
 */
fun FindingRequestBody.isValid(): Boolean {
    return when {
        this.title.isBlank() -> false
        this.description.isBlank() -> false
        this.impact.isBlank() -> false
        else -> true
    }
}

fun FindingRequestBody.toFinding(): Finding {
    return Finding(
        id = UUID.randomUUID().toString(),
        severity = Severity.valueOf(this.severity),
        title = this.title,
        description = this.description,
        impact = this.impact,
        affectedUrls = this.affectedUrls,
        reproduction = this.reproduction,
        mitigation = this.mitigation
    )
}
