package com.securityc4po.reporting.report.jasper

import java.io.File

class ReportUtil {
    companion object {
        fun extractReportName(reportFile: File): String {
            return reportFile.name.replace(".${reportFile.extension}", "")
        }
    }
}
