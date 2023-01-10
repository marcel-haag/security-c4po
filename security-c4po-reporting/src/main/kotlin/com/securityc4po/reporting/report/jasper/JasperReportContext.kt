package com.securityc4po.reporting.report.jasper

import com.securityc4po.reporting.report.jasper.export.JasperOutputFormat
import net.sf.jasperreports.engine.JRDataSource
import net.sf.jasperreports.engine.JREmptyDataSource
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.sql.Connection

/**
 * First shot of a so called report which holds all data which is relevant for a report to be able to be generated.
 * This should be extended as necessary. When extending it should be made sure that it is as abstract as possible and
 * also non blocking (streams over locations).
 * A special thing about this report context is that it is a composite or a recursive structure. This enables us to use
 * subreports. This structure can be simplified when we get a better understanding of Jasper whether it is for example
 * allowed that subreports can have their own datasources and so on.
 */
data class JasperReportContext(
    val name: String,
    val format: JasperOutputFormat,
    val designFileHash: String,
    val source: InputStream,
    val target: ByteArrayOutputStream,
    val subReports: List<JasperReportContext> = emptyList(),
    val dataSource: JRDataSource? = JREmptyDataSource(),
    val dataSourceConnection: Connection? = null,
    val parameters: Map<String, Any>? = mutableMapOf()
) {
    override fun equals(other: Any?): Boolean {
        return super.equals(other)
    }
}
