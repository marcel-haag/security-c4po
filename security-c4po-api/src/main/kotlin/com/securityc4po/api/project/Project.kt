package com.securityc4po.api.project

import com.fasterxml.jackson.annotation.JsonFormat
import com.securityc4po.api.ResponseBody
import com.securityc4po.api.pentest.PentestStatus
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.mongodb.core.index.Indexed
import java.math.RoundingMode
import java.text.DecimalFormat
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
    val projectPentests: List<ProjectPentest> = emptyList(),
    val createdBy: String
)

fun buildProject(body: ProjectRequestBody, projectEntity: ProjectEntity): Project{
    return Project(
        id = projectEntity.data.id,
        client = body.client,
        title = body.title,
        createdAt = projectEntity.data.createdAt,
        tester = body.tester,
        projectPentests = projectEntity.data.projectPentests,
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
            /* ToDo: Calculate percentage in BE type: float */
            "testingProgress" to calculateProgress(),
            "createdBy" to createdBy
    )
}

fun Project.toProjectDeleteResponseBody(): ResponseBody {
    return mapOf(
        "id" to id
    )
}



fun Project.calculateProgress(): Float {
    // Total number of pentests listet in the OWASP testing guide
    // https://owasp.org/www-project-web-security-testing-guide/assets/archive/OWASP_Testing_Guide_v4.pdf
    // @Value("\${owasp.web.pentests}")
    // lateinit var TOTALPENTESTS: Int
    val TOTALPENTESTS = 95

    return if (projectPentests.isEmpty())
        0F
    else {
        var completedPentests = 0
        projectPentests.forEach { projectPentest ->
            if (projectPentest.status == PentestStatus.COMPLETED) {
                completedPentests++
            }
        }
        val df = DecimalFormat("#.##")
        df.roundingMode = RoundingMode.DOWN
        val progress = completedPentests / TOTALPENTESTS
        df.format(progress).toFloat()
    }
}

data class ProjectOverview(
        val projects: List<Project>
)

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
