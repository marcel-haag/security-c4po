package com.securityc4po.reporting.remote.model

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.Instant

data class ProjectReport(
    val id: String,
    val client: String,
    val title: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    val createdAt: String = Instant.now().toString(),
    val tester: String,
    val summary: String? = null,
    var projectPentestReport: List<PentestReport> = emptyList(),
    val createdBy: String
)
