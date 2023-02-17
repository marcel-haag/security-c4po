package com.securityc4po.reporting.remote.model.api

data class Comment (
    val id: String,
    val title: String,
    val description: String,
    val relatedFindings: List<String>? = emptyList()
)
