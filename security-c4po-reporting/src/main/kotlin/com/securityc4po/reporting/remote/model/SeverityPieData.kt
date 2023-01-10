package com.securityc4po.reporting.remote.model

data class SeverityPieData (
    val severity: String, // ToDo: Change to be Severity enum if it can be read by Jasper
    var numberOfFindings: Int
)
