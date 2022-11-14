package com.securityc4po.api.comment

import com.securityc4po.api.BaseEntity
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "comments")
open class CommentEntity(
    data: Comment
) : BaseEntity<Comment>(data)

fun CommentEntity.toComment(): Comment {
    return Comment(
        this.data.id,
        this.data.title,
        this.data.description,
        this.data.relatedFindings
    )
}