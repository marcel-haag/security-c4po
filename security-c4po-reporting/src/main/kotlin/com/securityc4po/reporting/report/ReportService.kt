package com.securityc4po.reporting.report

import com.securityc4po.reporting.extensions.getLoggerFor
import com.securityc4po.reporting.remote.model.*
import net.sf.jasperreports.engine.*
import net.sf.jasperreports.engine.JRParameter.REPORT_RESOURCE_BUNDLE
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
import org.apache.pdfbox.io.MemoryUsageSetting
import org.apache.pdfbox.multipdf.PDFMergerUtility
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.io.*
import java.util.*
import kotlin.collections.HashMap


@Service
/*
* This Service makes use of the created Jasper Templates
* https://community.jaspersoft.com/system/files/restricted-docs/jaspersoft-studio-user-guide.pdf
*/
class ReportService {

    var logger = getLoggerFor<ReportService>()

    // Jasper Design template file Paths
    @Value("\${reportCoverDesignTemplate}")
    lateinit var reportCoverDesignTemplate: String

    @Value("\${reportContentDesignTemplate}")
    lateinit var reportContentDesignTemplate: String

    @Value("\${reportStateOfConfidentialityDesignTemplate}")
    lateinit var reportStateOfConfidentialityDesignTemplate: String

    @Value("\${reportExecutiveSummaryDesignTemplate}")
    lateinit var reportExecutiveSummaryDesignTemplate: String

    @Value("\${reportPentestsFindingsAndCommentsDesignTemplate}")
    lateinit var reportPentestsFindingsAndCommentsDesignTemplate: String

    @Value("\${reportPentestsFindingsOnlyDesignTemplate}")
    lateinit var reportPentestsFindingsOnlyDesignTemplate: String

    @Value("\${reportPentestsCommentsOnlyDesignTemplate}")
    lateinit var reportPentestsCommentsOnlyDesignTemplate: String

    @Value("\${reportAppendenciesDesignTemplate}")
    lateinit var reportAppendenciesDesignTemplate: String

    // Path to default pdf file
    @Value("\${reportDefaultPdf}")
    lateinit var reportDefaultPdfPropertyPath: String

    // Path to localization files
    @Value("\${localization}")
    lateinit var localizationRessourceBasePath: String

    // Image paths
    @Value("\${CDATA_WATERMARK}")
    lateinit var waterMarkPath: String

    @Value("\${CDATA_C4POCoverBackground}")
    lateinit var coverBackgroundPath: String

    // Subreport paths
    @Value("\${CDATA_FindingsSubreport}")
    lateinit var findingsSubreportPath: String

    @Value("\${CDATA_CommentsSubreport}")
    lateinit var commentsSubreportPath: String

    @Value("\${CDATA_SeverityRatingTable}")
    lateinit var severityRatingTablePath: String

    fun createReport(projectReportCollection: ProjectReport, reportFormat: String, reportLanguage: String): Mono<ByteArray> {
        // Setup PDFMergerUtility
        val mergedC4POPentestReport: PDFMergerUtility = PDFMergerUtility()
        // Setup ByteArrayOutputStream for "on the fly" file generation
        val penetstReportOutputstream = ByteArrayOutputStream()
        // Try to create report files & merge them together
        return createPentestReportFiles(projectReportCollection, reportFormat, reportLanguage, mergedC4POPentestReport).collectList()
            .map {
                // Merge report files
                mergedC4POPentestReport.destinationStream = penetstReportOutputstream
                mergedC4POPentestReport.mergeDocuments(MemoryUsageSetting.setupTempFileOnly())
            }.flatMap {
                return@flatMap Mono.just(penetstReportOutputstream.toByteArray())
            }.doOnError {
                logger.error("Report generation failed.")
            }
    }

    private fun createPentestReportFiles(
        projectReportCollection: ProjectReport,
        reportFormat: String,
        reportLanguage: String,
        mergedC4POPentestReport: PDFMergerUtility
    ): Flux<Unit> {
        // Setup ressource bundle for localization
        val resourceBundle = getRessourceBundle(reportLanguage)
        // Setup Flux to create report
        return Flux.just(
            // Create byte arrays of report files
            createCover(projectReportCollection, reportFormat, resourceBundle),
            createTableOfContent(projectReportCollection, reportFormat, resourceBundle),
            createStateOfConfidentiality(projectReportCollection, reportFormat, resourceBundle),
            createExecutiveSummary(projectReportCollection, reportFormat, resourceBundle),
            createPentestReports(projectReportCollection, reportFormat, resourceBundle),
            createAppendencies(reportFormat, resourceBundle)
        ).map { jasperObject ->
            if (jasperObject is ByteArray) {
                val reportFilesInputSteam = ByteArrayInputStream(jasperObject)
                mergedC4POPentestReport.addSource(reportFilesInputSteam)
            } else if (jasperObject is List<*>) {
                jasperObject.forEach { jasperFile ->
                    if (jasperFile is ByteArray) {
                        val reportFilesInputSteam = ByteArrayInputStream(jasperFile)
                        mergedC4POPentestReport.addSource(reportFilesInputSteam)
                    }
                }
            }
        }
    }

    private fun getRessourceBundle(reportLanguage: String): ResourceBundle {
        return if (reportLanguage.equals("de-DE")) {
            // Get the language code from the report parameter or other criteria
            val languageCode = "de"
            val locale = Locale(languageCode)
            ResourceBundle.getBundle(localizationRessourceBasePath, locale)
        }
        // Default to english
        else {
            // Get the language code from the report parameter or other criteria
            val languageCode = "en"
            val locale = Locale(languageCode)
            ResourceBundle.getBundle(localizationRessourceBasePath, locale)
        }
    }

    private fun createCover(projectReportCollection: ProjectReport, reportFormat: String, resourceBundle: ResourceBundle): ByteArray {
        // Load Jasper Files
        val fileCoverStream = javaClass.getResourceAsStream(reportCoverDesignTemplate)
        // Open file stream
        fileCoverStream.use { stream ->
            val inputStream = ByteArrayInputStream(stream.readAllBytes())
            // Compile Jasper Reports
            val jasperReportCover: JasperReport = JasperCompileManager.compileReport(inputStream)
            // Setup Main Datasource
            val dataSource: JRBeanCollectionDataSource =
                JRBeanCollectionDataSource(mutableListOf(projectReportCollection))
            // Setup Parameter & add Sub-datasets
            val parameters = HashMap<String, Any>()
            parameters["CDATA_WATERMARK"] = waterMarkPath
            parameters["CDATA_C4POCoverBackground"] = coverBackgroundPath
            // Adds the resource bundle into the report
            parameters[REPORT_RESOURCE_BUNDLE] = resourceBundle
            // Fill Reports
            val jasperPrintCover: JasperPrint = JasperFillManager.fillReport(jasperReportCover, parameters, dataSource)
            // Create File
            var finalFile: ByteArray = javaClass.getResourceAsStream(reportDefaultPdfPropertyPath).readAllBytes()
            // Export Report
            return if (reportFormat.equals("pdf")) {
                finalFile = JasperExportManager.exportReportToPdf(jasperPrintCover)
                finalFile
            } else {
                // ToDo: Implement different report formats
                finalFile
            }
        }
    }

    private fun createTableOfContent(projectReportCollection: ProjectReport, reportFormat: String, resourceBundle: ResourceBundle): ByteArray {
        // Load Jasper Files
        val fileContentStream = javaClass.getResourceAsStream(reportContentDesignTemplate)
        // Open file stream
        fileContentStream.use { stream ->
            val inputStream = ByteArrayInputStream(stream.readAllBytes())
            // Compile Jasper Reports
            val jasperReportContent: JasperReport = JasperCompileManager.compileReport(inputStream)
            // Setup Sub-dataset for Table of Content generation
            val projectPentestReportDataSource: JRBeanCollectionDataSource =
                JRBeanCollectionDataSource(projectReportCollection.projectPentestReport)
            // Setup Parameter & add Sub-datasets
            val parameters = HashMap<String, Any>()
            parameters["ProjectPentestReportDataSource"] = projectPentestReportDataSource
            parameters["CDATA_WATERMARK"] = waterMarkPath
            // Adds the resource bundle into the report
            parameters[REPORT_RESOURCE_BUNDLE] = resourceBundle
            // Fill Reports
            val jasperPrintContent: JasperPrint =
                JasperFillManager.fillReport(jasperReportContent, parameters, JREmptyDataSource())
            // Create File
            var finalFile: ByteArray = javaClass.getResourceAsStream(reportDefaultPdfPropertyPath).readAllBytes()
            // Export Report
            return if (reportFormat.equals("pdf")) {
                finalFile = JasperExportManager.exportReportToPdf(jasperPrintContent)
                finalFile
            } else {
                // ToDo: Implement different report formats
                finalFile
            }
        }
    }

    private fun createStateOfConfidentiality(projectReportCollection: ProjectReport, reportFormat: String, resourceBundle: ResourceBundle): ByteArray {
        // Load Jasper Files
        val fileStateOfConfidentialityStream = javaClass.getResourceAsStream(reportStateOfConfidentialityDesignTemplate)
        // Open file stream
        fileStateOfConfidentialityStream.use { stream ->
            val inputStream = ByteArrayInputStream(stream.readAllBytes())
            // Compile Jasper Reports
            val jasperReportContent: JasperReport = JasperCompileManager.compileReport(inputStream)
            // Setup Main Datasource
            val dataSource: JRBeanCollectionDataSource =
                JRBeanCollectionDataSource(mutableListOf(projectReportCollection))
            // Setup Parameter & add Sub-datasets
            val parameters = HashMap<String, Any>()
            parameters["CDATA_WATERMARK"] = waterMarkPath
            // Adds the resource bundle into the report
            parameters[REPORT_RESOURCE_BUNDLE] = resourceBundle
            // Fill Reports
            val jasperPrintStateOfConfidentiality: JasperPrint =
                JasperFillManager.fillReport(jasperReportContent, parameters, dataSource)
            // Create File
            var finalFile: ByteArray = javaClass.getResourceAsStream(reportDefaultPdfPropertyPath).readAllBytes()
            return if (reportFormat.equals("pdf")) {
                finalFile = JasperExportManager.exportReportToPdf(jasperPrintStateOfConfidentiality)
                finalFile
            } else {
                // ToDo: Implement different report formats
                finalFile
            }
        }
    }

    private fun createExecutiveSummary(projectReportCollection: ProjectReport, reportFormat: String, resourceBundle: ResourceBundle): ByteArray {
        // Load Jasper Files
        val fileExecutiveSummaryStream = javaClass.getResourceAsStream(reportExecutiveSummaryDesignTemplate)
        // Open file stream
        fileExecutiveSummaryStream.use { stream ->
            val inputStream = ByteArrayInputStream(stream.readAllBytes())
            // Compile Jasper Reports
            val jasperReportContent: JasperReport = JasperCompileManager.compileReport(inputStream)
            // Setup Main Datasource
            val dataSource: JRBeanCollectionDataSource =
                JRBeanCollectionDataSource(mutableListOf(projectReportCollection))
            // Setup Sub-dataset for pentest evaluation pie charts
            // Setup CategoryPieDataSet for each Category
            val categoryFindings: MutableList<CategoryPieData> = mutableListOf<CategoryPieData>(
                CategoryPieData("INFORMATION_GATHERING", 0),
                CategoryPieData("CONFIGURATION_AND_DEPLOY_MANAGEMENT_TESTING", 0),
                CategoryPieData("IDENTITY_MANAGEMENT_TESTING", 0),
                CategoryPieData("AUTHENTICATION_TESTING", 0),
                CategoryPieData("AUTHORIZATION_TESTING", 0),
                CategoryPieData("SESSION_MANAGEMENT_TESTING", 0),
                CategoryPieData("INPUT_VALIDATION_TESTING", 0),
                CategoryPieData("ERROR_HANDLING", 0),
                CategoryPieData("CRYPTOGRAPHY", 0),
                CategoryPieData("BUSINESS_LOGIC_TESTING", 0),
                CategoryPieData("CLIENT_SIDE_TESTING", 0),
                CategoryPieData("API_TESTING", 0)
            )
            // Fill data for CategoryPieDataSet
            for (i in 0 until projectReportCollection.projectPentestReport.size) {
                when (projectReportCollection.projectPentestReport[i].category) {
                    "INFORMATION_GATHERING" -> {
                        categoryFindings[0].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "CONFIGURATION_AND_DEPLOY_MANAGEMENT_TESTING" -> {
                        categoryFindings[1].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "IDENTITY_MANAGEMENT_TESTING" -> {
                        categoryFindings[2].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "AUTHENTICATION_TESTING" -> {
                        categoryFindings[3].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "AUTHORIZATION_TESTING" -> {
                        categoryFindings[4].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "SESSION_MANAGEMENT_TESTING" -> {
                        categoryFindings[5].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "INPUT_VALIDATION_TESTING" -> {
                        categoryFindings[6].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "ERROR_HANDLING" -> {
                        categoryFindings[7].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "CRYPTOGRAPHY" -> {
                        categoryFindings[8].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "BUSINESS_LOGIC_TESTING" -> {
                        categoryFindings[9].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "CLIENT_SIDE_TESTING" -> {
                        categoryFindings[10].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    "API_TESTING" -> {
                        categoryFindings[11].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size
                    }

                    else -> {
                        categoryFindings.add(
                            CategoryPieData(
                                "UNKNOWN_CATEGORY",
                                projectReportCollection.projectPentestReport[i].findings.size
                            )
                        )
                    }
                }
            }
            val categoryFindingsDataSource: JRBeanCollectionDataSource = JRBeanCollectionDataSource(categoryFindings)
            // Setup SeverityPieData for each Severity
            val severityFindings: MutableList<SeverityPieData> = mutableListOf<SeverityPieData>(
                SeverityPieData("LOW", 0),
                SeverityPieData("MEDIUM", 0),
                SeverityPieData("HIGH", 0),
                SeverityPieData("CRITICAL", 0)
            )
            // Fill data for SeverityPieData
            for (i in 0 until projectReportCollection.projectPentestReport.size) {
                for (j in 0 until projectReportCollection.projectPentestReport[i].findings.size) {
                    when (projectReportCollection.projectPentestReport[i].findings[j].severity) {
                        "LOW" -> {
                            severityFindings[0].numberOfFindings += 1
                        }

                        "MEDIUM" -> {
                            severityFindings[1].numberOfFindings += 1
                        }

                        "HIGH" -> {
                            severityFindings[2].numberOfFindings += 1
                        }

                        "CRITICAL" -> {
                            severityFindings[3].numberOfFindings += 1
                        }
                        else -> {
                            severityFindings.add(
                                SeverityPieData(
                                    "UNKNOWN_SEVERITY",
                                    projectReportCollection.projectPentestReport[i].findings.size
                                )
                            )
                        }
                    }
                }
            }
            val severityFindingsDataSource: JRBeanCollectionDataSource = JRBeanCollectionDataSource(severityFindings)
            // Setup Parameter & add Sub-datasets
            val parameters = HashMap<String, Any>()
            parameters["CategoryFindingsPieChartDataSource"] = categoryFindingsDataSource
            parameters["SeverityFindingsPieChartDataSource"] = severityFindingsDataSource
            parameters["CDATA_WATERMARK"] = waterMarkPath
            // Adds the resource bundle into the report
            parameters[REPORT_RESOURCE_BUNDLE] = resourceBundle
            // Fill Reports
            val jasperPrintExecutiveSummary: JasperPrint =
                JasperFillManager.fillReport(jasperReportContent, parameters, dataSource)
            // Create File
            var finalFile: ByteArray = javaClass.getResourceAsStream(reportDefaultPdfPropertyPath).readAllBytes()
            return if (reportFormat.equals("pdf")) {
                finalFile = JasperExportManager.exportReportToPdf(jasperPrintExecutiveSummary)
                finalFile
            } else {
                // ToDo: Implement different report formats
                finalFile
            }
        }
    }

    private fun createPentestReports(projectReportCollection: ProjectReport, reportFormat: String, resourceBundle: ResourceBundle): List<ByteArray> {
        // Create List of Files
        var finalFiles: List<ByteArray> = emptyList()
        // Load Jasper Files
        val filePentestsFindingsAndCommentsStream =
            javaClass.getResourceAsStream(reportPentestsFindingsAndCommentsDesignTemplate)
        val filePentestsFindingsOnlyStream = javaClass.getResourceAsStream(reportPentestsFindingsOnlyDesignTemplate)
        val filePentestsCommentsOnlyStream = javaClass.getResourceAsStream(reportPentestsCommentsOnlyDesignTemplate)
        // Open file stream for findings & comments
        filePentestsFindingsAndCommentsStream.use { pentestsFindingsAndCommentsStream ->
            val inputFindingsAndCommentsStream = ByteArrayInputStream(pentestsFindingsAndCommentsStream.readAllBytes())
            // Setup Jasper Report
            val jasperReportPentestsFindingsAndComments =
                JasperCompileManager.compileReport(inputFindingsAndCommentsStream)
            // Open file stream for findings only
            filePentestsFindingsOnlyStream.use { pentestsFindingsOnlyStream ->
                val inputFindingsOnlyStream = ByteArrayInputStream(pentestsFindingsOnlyStream.readAllBytes())
                // Setup Jasper Report
                val jasperReportPentestsFindingsOnly: JasperReport =
                    JasperCompileManager.compileReport(inputFindingsOnlyStream)
                // Open file stream for comments only
                filePentestsCommentsOnlyStream.use { pentestsCommentsOnlyStream ->
                    val inputCommentsOnlyStream = ByteArrayInputStream(pentestsCommentsOnlyStream.readAllBytes())
                    // Setup Jasper Report
                    val jasperReportPentestsCommentsOnly: JasperReport =
                        JasperCompileManager.compileReport(inputCommentsOnlyStream)
                    // Create pentestReport content for every objective
                    for (i in 0 until projectReportCollection.projectPentestReport.size) {
                        val projectSinglePentestReportDataSource: JRBeanCollectionDataSource =
                            JRBeanCollectionDataSource(mutableListOf(projectReportCollection.projectPentestReport[i]))
                        // Setup Parameter & add Sub-datasets
                        val parameters = HashMap<String, Any>()
                        // Setup Sub-dataset for Findings of Pentest
                        parameters["PentestFindingsDataSource"] =
                            JRBeanCollectionDataSource(projectReportCollection.projectPentestReport[i].findings)
                        // Setup Sub-dataset for Comments of Pentest
                        parameters["PentestCommentsDataSource"] =
                            JRBeanCollectionDataSource(projectReportCollection.projectPentestReport[i].comments)
                        parameters["CDATA_WATERMARK"] = waterMarkPath
                        parameters["CDATA_FindingsSubreport"] = findingsSubreportPath
                        parameters["CDATA_CommentsSubreport"] = commentsSubreportPath
                        // Adds the resource bundle into the report
                        parameters[REPORT_RESOURCE_BUNDLE] = resourceBundle
                        // Fill Reports
                        // Print one report for each objective and merge them together afterwards
                        val jasperPrintPentests: JasperPrint =
                            if (projectReportCollection.projectPentestReport[i].findings.isEmpty()) {
                                JasperFillManager.fillReport(
                                    jasperReportPentestsCommentsOnly,
                                    parameters,
                                    projectSinglePentestReportDataSource
                                )
                            } else if (projectReportCollection.projectPentestReport[i].comments.isEmpty()) {
                                JasperFillManager.fillReport(
                                    jasperReportPentestsFindingsOnly,
                                    parameters,
                                    projectSinglePentestReportDataSource
                                )
                            } else {
                                JasperFillManager.fillReport(
                                    jasperReportPentestsFindingsAndComments,
                                    parameters,
                                    projectSinglePentestReportDataSource
                                )
                            }
                        // Create File
                        val finalFile: ByteArray =
                            javaClass.getResourceAsStream(reportDefaultPdfPropertyPath).readAllBytes()
                        // var finalFile: ByteArray = javaClass.getResourceAsStream(reportDefaultPdfProperty).readAllBytes()
                        if (reportFormat.equals("pdf")) {
                            finalFiles += JasperExportManager.exportReportToPdf(jasperPrintPentests)
                        } else {
                            // ToDo: Implement different report formats
                            finalFiles += (finalFile)
                        }
                    }
                }
            }
        }
        return finalFiles
    }

    private fun createAppendencies(reportFormat: String, resourceBundle: ResourceBundle): ByteArray {
        // Load Jasper Files
        val fileAppendenciesStream = javaClass.getResourceAsStream(reportAppendenciesDesignTemplate)
        // Open file stream
        fileAppendenciesStream.use { stream ->
            val inputStream = ByteArrayInputStream(stream.readAllBytes())
            // Compile Jasper Reports
            val jasperReportCover: JasperReport = JasperCompileManager.compileReport(inputStream)
            // Setup Parameter & add Sub-datasets
            val parameters = HashMap<String, Any>()
            parameters["SeverityRatingDefinition"] = JREmptyDataSource()
            parameters["CDATA_WATERMARK"] = waterMarkPath
            parameters["CDATA_SeverityRatingTable"] = severityRatingTablePath
            // Adds the resource bundle into the report
            parameters[REPORT_RESOURCE_BUNDLE] = resourceBundle
            // Fill Reports
            val jasperPrintAppendencies: JasperPrint =
                JasperFillManager.fillReport(jasperReportCover, parameters, JREmptyDataSource())
            // Create File
            var finalFile: ByteArray = javaClass.getResourceAsStream(reportDefaultPdfPropertyPath).readAllBytes()
            return if (reportFormat.equals("pdf")) {
                finalFile = JasperExportManager.exportReportToPdf(jasperPrintAppendencies)
                finalFile
            } else {
                // ToDo: Implement different report formats
                finalFile
            }
        }
    }
}