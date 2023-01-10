package com.securityc4po.reporting.remote.model

data class CategoryPieData (
    val category: String, // ToDo: Change to be PentestCategory enum if it can be read by Jasper
    var numberOfFindings: Int
)
