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
    val createdBy: String
)

fun buildProject(body: ProjectRequestBody, projectEntity: ProjectEntity): Project{
    return Project(
        id = projectEntity.data.id,
        client = body.client,
        title = body.title,
        createdAt = projectEntity.data.createdAt,
        tester = body.tester,
        createdBy = projectEntity.data.createdBy
    )
}

fun Project.toProjectResponseBody(): ResponseBody {
    return mapOf(
            "id" to id,
            "client" to client,
            "title" to title,
            "createdAt" to createdAt,
            "tester" to tester,
            "createdBy" to createdBy
    )
}

fun Project.toProjectDeleteResponseBody(): ResponseBody {
    return mapOf(
        "id" to id
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

data class ProjectRequestBody(
    val client: String,
    val title: String,
    val tester: String
)

/**
 * Validates if a [ProjectRequestBody] is valid
 *
 * @return Boolean describing if the body is valid
 */
fun ProjectRequestBody.isValid(): Boolean {
    return when {
        this.client.isBlank() -> false
        this.title.isBlank() -> false
        this.tester.isBlank() -> false
        else -> true
    }
}

fun ProjectRequestBody.toProject(): Project {
    return Project(
        id = UUID.randomUUID().toString(),
        client = this.client,
        title = this.title,
        createdAt = Instant.now().toString(),
        tester = this.tester,
        // ToDo: Should be changed to SUB from Token after adding AUTH Header
        createdBy = UUID.randomUUID().toString()

)
}
