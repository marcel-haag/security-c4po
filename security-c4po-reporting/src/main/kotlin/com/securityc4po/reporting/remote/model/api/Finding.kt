package com.securityc4po.reporting.remote.model.api

data class Finding (
    val id: String,
    val severity: String, // ToDo: Change to be Severity enum if it can be read by Jasper
    val title: String,
    val description: String,
    val impact: String,
    val affectedUrls: List<String>? = emptyList(),
    val reproduction: String,
    val mitigation: String?
)

enum class Severity {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
