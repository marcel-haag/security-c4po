package com.securityc4po.reporting.report.jasper

import net.sf.jasperreports.engine.JasperPrint

interface ReportExporter {

    fun export(reportContext: JasperReportContext, filledReports: List<JasperPrint>)

}
