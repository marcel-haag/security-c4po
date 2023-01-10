package com.securityc4po.reporting.report.jasper.export

import com.securityc4po.reporting.report.jasper.ReportExporter

enum class JasperOutputFormat {
    PDF,
    CSV,
    HTML,
    XLS;

    companion object {
        fun fileEnding(format: JasperOutputFormat): String {
            return ".${format.name.toLowerCase()}"
        }

        fun createExporter(format: JasperOutputFormat): ReportExporter {
            return when(format) {
                PDF -> ReportExporterPDF()
                /*CSV -> ReportExporterCSV()
                HTML -> ReportExporterHTML()
                XLS -> ReportExporterXLS()*/
                else -> {ReportExporterPDF()}
            }
        }
    }
}
