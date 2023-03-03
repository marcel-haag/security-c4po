package com.securityc4po.reporting.remote.model.api

data class Comment (
    val id: String,
    val title: String,
    val description: String,
    val relatedFindings: List<String>? = emptyList(),
    // List of attachment id's for file upload
    val attachments: List<String>? = emptyList()
)
