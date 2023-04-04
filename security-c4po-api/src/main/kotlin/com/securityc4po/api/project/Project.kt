package com.securityc4po.api.project

import com.fasterxml.jackson.annotation.JsonFormat
import com.securityc4po.api.ResponseBody
import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.pentest.PentestStatus
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.data.mongodb.core.index.Indexed
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.Instant
import java.util.UUID

data class Project(
    @Indexed(background = true, unique = true)
    val id: String = UUID.randomUUID().toString(),
    val client: String,
    val title: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    val createdAt: String = Instant.now().toString(),
    val tester: String,
    val summary: String? = null,
    val state: PentestState,
    var projectPentests: List<ProjectPentest> = emptyList(),
    val createdBy: String
)

fun buildProject(body: ProjectRequestBody, projectEntity: ProjectEntity): Project {
    return Project(
        id = projectEntity.data.id,
        client = body.client,
        title = body.title,
        createdAt = projectEntity.data.createdAt,
        tester = body.tester,
        summary = body.summary,
        state = body.state,
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
        "summary" to summary,
        "state" to state,
        /* ToDo: Calculate percentage in BE type: float */
        "testingProgress" to calculateProgress(),
        "createdBy" to createdBy
    )
}

@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION, MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION)
fun Project.toProjectCompletedPentestResponseBody(): ResponseBody {
    return mapOf(
        "id" to id,
        "client" to client,
        "title" to title,
        "createdAt" to createdAt,
        "tester" to tester,
        "summary" to summary,
        "projectPentests" to projectPentests.filter { pentest -> pentest.status == PentestStatus.COMPLETED },
        "createdBy" to createdBy
    )
}

@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION, MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION)
fun Project.toProjectEvaluatedPentestResponseBody(): ResponseBody {
    return mapOf(
        "id" to id,
        "client" to client,
        "title" to title,
        "createdAt" to createdAt,
        "tester" to tester,
        "summary" to summary,
        "projectPentests" to projectPentests,
        "createdBy" to createdBy
    )
}

fun Project.toProjectDeleteResponseBody(): ResponseBody {
    return mapOf(
        "id" to id
    )
}


fun Project.calculateProgress(): BigDecimal {
    // Total number of pentests listet in the OWASP testing guide
    // https://owasp.org/www-project-web-security-testing-guide/assets/archive/OWASP_Testing_Guide_v4.pdf
    // @Value("\${owasp.web.objectives}")
    // lateinit var TOTALPENTESTS: Int
    val TOTAL_OWASP_OBJECTIVES = 95.0

    return if (projectPentests.isEmpty())
        BigDecimal.ZERO
    else {
        var completedPentests = 0.0
        projectPentests.forEach { projectPentest ->
            println(projectPentest.toString())
            if (projectPentest.status == PentestStatus.COMPLETED) {
                completedPentests += 1.0
            } else if (projectPentest.status != PentestStatus.NOT_STARTED) {
                completedPentests += 0.5
            }
        }
        val progress = (completedPentests * 100) / TOTAL_OWASP_OBJECTIVES
        BigDecimal(progress).setScale(2, RoundingMode.HALF_UP)
    }
}

data class ProjectOverview(
    val projects: List<Project>
)

data class ProjectRequestBody(
    val client: String,
    val title: String,
    val tester: String,
    val state: PentestState,
    val summary: String?
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
        this.state.toString().isBlank() -> false
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
        summary = this.summary,
        state = this.state,
        // ToDo: Should be changed to SUB from Token after adding AUTH Header
        createdBy = UUID.randomUUID().toString()
    )
}
