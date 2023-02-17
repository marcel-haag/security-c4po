package com.securityc4po.reporting.remote.model

data class ProjectReport(
    val id: String,
    val client: String,
    val title: String,
    val createdAt: String,
    val tester: String,
    val summary: String? = null,
    var projectPentestReport: MutableList<PentestReport> = mutableListOf<PentestReport>(),
    val createdBy: String
)
