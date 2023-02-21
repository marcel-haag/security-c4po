package com.securityc4po.reporting.remote.model.api

import com.securityc4po.reporting.remote.model.PentestReport
import com.securityc4po.reporting.remote.model.ProjectReport

data class Project(
    val id: String,
    val client: String,
    val title: String,
    val createdAt: String,
    val tester: String,
    val summary: String? = null,
    var projectPentests: List<ProjectPentest>? = emptyList(),
    val createdBy: String
)

fun Project.toProjectReport(): ProjectReport {
    return ProjectReport(
        id = this.id,
        client = this.client,
        title = this.title,
        createdAt = this.createdAt,
        tester = this.tester,
        summary = this.summary,
        projectPentestReport = mutableListOf<PentestReport>(),
        createdBy = this.createdBy
    )
}

data class ProjectPentest(
    val pentestId: String,
    var status: String
)