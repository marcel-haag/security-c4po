package com.securityc4po.api.comment

import com.securityc4po.api.ResponseBody
import com.securityc4po.api.finding.FindingRequestBody
import org.springframework.data.mongodb.core.index.Indexed
import java.util.*

data class Comment (
    @Indexed(background = true, unique = true)
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val relatedFindings: List<String>? = emptyList()
)

fun buildComment(body: CommentRequestBody, commentEntity: CommentEntity): Comment {
    return Comment(
        id = commentEntity.data.id,
        title = body.title,
        description = body.description,
        relatedFindings = body.relatedFindings
    )
}

data class CommentRequestBody(
    val title: String,
    val description: String,
    val relatedFindings: List<String>? = emptyList()
)

fun Comment.toCommentResponseBody(): ResponseBody {
    return mapOf(
        "id" to id,
        "title" to title,
        "description" to description,
        "relatedFindings" to relatedFindings
    )
}

fun Comment.toCommentDeleteResponseBody(): ResponseBody {
    return mapOf(
        "id" to id
    )
}

/**
 * Validates if a [FindingRequestBody] is valid
 *
 * @return Boolean describing if the body is valid
 */
fun CommentRequestBody.isValid(): Boolean {
    return when {
        this.title.isBlank() -> false
        this.description.isBlank() -> false
        else -> true
    }
}

fun CommentRequestBody.toComment(): Comment {
    return Comment(
        id = UUID.randomUUID().toString(),
        title = this.title,
        description = this.description,
        relatedFindings = this.relatedFindings
    )
}
