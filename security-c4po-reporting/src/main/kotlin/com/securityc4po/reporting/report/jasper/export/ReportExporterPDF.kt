package com.securityc4po.reporting.report.jasper.export

import com.securityc4po.reporting.report.jasper.JasperReportContext
import com.securityc4po.reporting.report.jasper.ReportExporter
import net.sf.jasperreports.engine.JasperPrint
import net.sf.jasperreports.engine.export.JRPdfExporter
import net.sf.jasperreports.export.SimpleExporterInput
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput
import net.sf.jasperreports.export.SimplePdfExporterConfiguration
import net.sf.jasperreports.export.SimplePdfReportConfiguration

class ReportExporterPDF: ReportExporter {

    override fun export(reportContext: JasperReportContext, filledReports: List<JasperPrint>) {
        val exporter = JRPdfExporter()
        exporter.setExporterInput(SimpleExporterInput.getInstance(filledReports))
        exporter.exporterOutput = SimpleOutputStreamExporterOutput(reportContext.target)

        // TODO make report ReportExportConfiguration customizable? -> parameter?
        val reportConfig = SimplePdfReportConfiguration()
        reportConfig.isSizePageToContent = true
        reportConfig.isForceLineBreakPolicy = false

        // TODO make ExporterConfiguration customizable? -> parameter?
        val exportConfig = SimplePdfExporterConfiguration()
        exportConfig.metadataAuthor = "Author"
        exportConfig.isEncrypted = true
        exportConfig.setAllowedPermissionsHint("PRINTING")

        exporter.setConfiguration(reportConfig)
        exporter.setConfiguration(exportConfig)

        exporter.exportReport()
    }
}
