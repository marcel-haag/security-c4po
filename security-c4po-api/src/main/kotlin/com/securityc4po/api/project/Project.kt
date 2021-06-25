package com.securityc4po.api.project

import com.fasterxml.jackson.annotation.JsonFormat
import com.securityc4po.api.ResponseBody
import org.springframework.data.mongodb.core.index.Indexed
import java.time.Instant
import java.util.UUID

data class Project(
    @Indexed(background = true, unique = true)
    val id: String = UUID.randomUUID().toString(),
    val client: String,
    val title: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    val createdAt: String = Instant.now().toString(),
    val tester: String? = null,
    val logo: String? = null
)

fun Project.toProjectResponseBody(): ResponseBody {
    return kotlin.collections.mapOf(
            "id" to id,
            "client" to client,
            "title" to title,
            "createdAt" to createdAt,
            "tester" to tester,
            "logo" to logo
    )
}

data class ProjectOverview(
        val projects: List<Project>
)

fun ProjectOverview.toProjectOverviewResponseBody(): ResponseBody {
    return mapOf(
            "projects" to projects
    )
}
