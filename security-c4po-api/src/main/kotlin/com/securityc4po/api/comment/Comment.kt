package com.securityc4po.api.comment

import org.springframework.data.mongodb.core.index.Indexed
import java.util.*

data class Comment (
    @Indexed(background = true, unique = true)
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val relatedFindings: List<String>? = emptyList()
)
