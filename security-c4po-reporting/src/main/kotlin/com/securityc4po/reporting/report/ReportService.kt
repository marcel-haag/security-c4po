package com.securityc4po.reporting.report

import com.securityc4po.reporting.extensions.getLoggerFor
import com.securityc4po.reporting.remote.model.*
import net.sf.jasperreports.engine.*
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
import org.apache.commons.io.FileUtils
import org.apache.pdfbox.multipdf.PDFMergerUtility
import org.springframework.stereotype.Service
import org.springframework.util.ResourceUtils
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import java.io.File

@Service
/*
* This Service makes use of the created Jasper Templates
* https://community.jaspersoft.com/system/files/restricted-docs/jaspersoft-studio-user-guide.pdf
*/
class ReportService {

    var logger = getLoggerFor<ReportService>()

    private val reportCoverDesignTemplate = "./src/main/resources/jasper/reports/c4po_cover.jrxml"
    private val reportContentDesignTemplate = "./src/main/resources/jasper/reports/c4po_content.jrxml"
    private val reportStateOfConfidentialityDesignTemplate = "./src/main/resources/jasper/reports/c4po_state_of_confidentiality.jrxml"
    private val reportExecutiveSummaryDesignTemplate = "./src/main/resources/jasper/reports/c4po_executive_summary.jrxml"
    private val reportPentestsDesignTemplate = "./src/main/resources/jasper/reports/c4po_pentests.jrxml"
    private val reportAppendenciesDesignTemplate = "./src/main/resources/jasper/reports/c4po_appendencies.jrxml"

    // Path to default pdf file
    private val reportDefaultPdf = "./src/main/resources/jasper/DEFAULT.pdf"

    // Path where the created Reports are saved
    private val reportDestination = "./src/main/resources/jasper/reportPDFs/"
    // Path where the completed Report is saved
    private val reportFileDestination = "./src/main/resources/jasper/finalReport/"
    // Path where the completed Report can be found by class loader
    private val reportFileForClassLoader = "/jasper/finalReport/"

    fun createReport(projectReportCollection: ProjectReport, reportFormat: String): Mono<String> {
        val C4POPentestReport: PDFMergerUtility = PDFMergerUtility()
        val reportFilePathDestination: String = reportFileDestination + projectReportCollection.title.replace(" ", "_") + "_report.pdf"
        val reportFilePathForClassLoader: String = reportFileForClassLoader + projectReportCollection.title.replace(" ", "_") + "_report.pdf"
        // Try to create report files & merge them together
        return try {
            // Create report files
            val coverFile: File = createCover(projectReportCollection, reportFormat)
            val contentFile: File = createTableOfContent(projectReportCollection, reportFormat)
            val confidentialityFile: File = createStateOfConfidentiality(projectReportCollection, reportFormat)
            val summaryFile: File = createExecutiveSummary(projectReportCollection, reportFormat)
            val pentestFiles: List<File> = createPentestReports(projectReportCollection, reportFormat)
            val appendenciesFile: File = createAppendencies(reportFormat)
            // Add files to [C4POPentestReport]
            C4POPentestReport.addSource(coverFile)
            C4POPentestReport.addSource(contentFile)
            C4POPentestReport.addSource(confidentialityFile)
            C4POPentestReport.addSource(summaryFile)
            // Merge every Pentestreport file in List of File
            pentestFiles.forEach { pentestFile -> C4POPentestReport.addSource(pentestFile) }
            C4POPentestReport.addSource(appendenciesFile)
            // Save completed report
            C4POPentestReport.destinationFileName = reportFilePathDestination
            C4POPentestReport.mergeDocuments()
            reportFilePathForClassLoader.toMono()
        } catch (e: Exception) {
            logger.error("Report generation failed.")
            Mono.just("")
        }
    }

    fun cleanUpFiles() {
        val cleanUpDirectoryReportsPath = "./src/main/resources/jasper/reportPDFs"
        val cleanUpDirectoryCompletedReportsPath = "./src/main/resources/jasper/finalReport"
        try {
            FileUtils.cleanDirectory(File(cleanUpDirectoryReportsPath))
            FileUtils.cleanDirectory(File(cleanUpDirectoryCompletedReportsPath))
        } catch (e: Exception) {
            logger.error("Report file cleanup failed with exception: ", e)
        }

    }

    private fun createCover(projectReportCollection: ProjectReport, reportFormat: String): File {
        // Load Jasper Files
        val fileCover: File = ResourceUtils.getFile(reportCoverDesignTemplate)
        // Compile Jasper Reports
        val jasperReportCover: JasperReport = JasperCompileManager.compileReport(fileCover.absolutePath)
        // Setup Main Datasource
        val dataSource: JRBeanCollectionDataSource = JRBeanCollectionDataSource(mutableListOf(projectReportCollection))
        // Setup Parameter & add Sub-datasets
        val parameters = HashMap<String, Any>()
        // Fill Reports
        val jasperPrintCover: JasperPrint = JasperFillManager.fillReport(jasperReportCover, parameters, dataSource)
        // Create File
        var finalFile: File = File(reportDefaultPdf)
        return if (reportFormat.equals("pdf")) {
            JasperExportManager.exportReportToPdfFile(jasperPrintCover, reportDestination + "A_Cover.pdf")
            finalFile = File(reportDestination + "A_Cover.pdf")
            finalFile
        } else {
            // ToDo: Implement different report formats
            finalFile
        }
    }

    private fun createTableOfContent(projectReportCollection: ProjectReport, reportFormat: String): File {
        // Load Jasper Files
        val fileContent: File = ResourceUtils.getFile(reportContentDesignTemplate)
        // Compile Jasper Reports
        val jasperReportContent: JasperReport = JasperCompileManager.compileReport(fileContent.absolutePath)
        // Setup Sub-dataset for Table of Content generation
        val projectPentestReportDataSource: JRBeanCollectionDataSource =
            JRBeanCollectionDataSource(projectReportCollection.projectPentestReport)
        // Setup Parameter & add Sub-datasets
        val parameters = HashMap<String, Any>()
        parameters["ProjectPentestReportDataSource"] = projectPentestReportDataSource
        // Fill Reports
        val jasperPrintContent: JasperPrint =
            JasperFillManager.fillReport(jasperReportContent, parameters, JREmptyDataSource())
        // Create File
        var finalFile: File = File(reportDefaultPdf)
        return if (reportFormat.equals("pdf")) {
            JasperExportManager.exportReportToPdfFile(jasperPrintContent, reportDestination + "B_Content.pdf")
            finalFile = File(reportDestination + "B_Content.pdf")
            finalFile
        } else {
            // ToDo: Implement different report formats
            finalFile
        }
    }

    private fun createStateOfConfidentiality(projectReportCollection: ProjectReport, reportFormat: String): File {
        // Load Jasper Files
        val fileContent: File = ResourceUtils.getFile(reportStateOfConfidentialityDesignTemplate)
        // Compile Jasper Reports
        val jasperReportContent: JasperReport = JasperCompileManager.compileReport(fileContent.absolutePath)
        // Setup Main Datasource
        val dataSource: JRBeanCollectionDataSource = JRBeanCollectionDataSource(mutableListOf(projectReportCollection))
        // Setup Parameter & add Sub-datasets
        val parameters = HashMap<String, Any>()
        // Fill Reports
        val jasperPrintContent: JasperPrint = JasperFillManager.fillReport(jasperReportContent, parameters, dataSource)
        // Create File
        var finalFile: File = File(reportDefaultPdf)
        return if (reportFormat.equals("pdf")) {
            JasperExportManager.exportReportToPdfFile(
                jasperPrintContent,
                reportDestination + "C_StateOfConfidentiality.pdf"
            )
            finalFile = File(reportDestination + "C_StateOfConfidentiality.pdf")
            finalFile
        } else {
            // ToDo: Implement different report formats
            finalFile
        }
    }

    private fun createExecutiveSummary(projectReportCollection: ProjectReport, reportFormat: String): File {
        // Load Jasper Files
        val fileContent: File = ResourceUtils.getFile(reportExecutiveSummaryDesignTemplate)
        // Compile Jasper Reports
        val jasperReportContent: JasperReport = JasperCompileManager.compileReport(fileContent.absolutePath)
        // Setup Main Datasource
        val dataSource: JRBeanCollectionDataSource = JRBeanCollectionDataSource(mutableListOf(projectReportCollection))
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
            CategoryPieData("CLIENT_SIDE_TESTING", 0)
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
                    categoryFindings[9].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size - 1
                }

                "CLIENT_SIDE_TESTING" -> {
                    categoryFindings[10].numberOfFindings += projectReportCollection.projectPentestReport[i].findings.size - 1
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
        // Fill Reports
        val jasperPrintContent: JasperPrint = JasperFillManager.fillReport(jasperReportContent, parameters, dataSource)
        // Create File
        var finalFile: File = File(reportDefaultPdf)
        return if (reportFormat.equals("pdf")) {
            JasperExportManager.exportReportToPdfFile(jasperPrintContent,reportDestination + "D_ExecutiveSummary.pdf")
            finalFile = File(reportDestination + "D_ExecutiveSummary.pdf")
            finalFile
        } else {
            // ToDo: Implement different report formats
            finalFile
        }
    }

    private fun createPentestReports(projectReportCollection: ProjectReport, reportFormat: String): List<File> {
        // Create List of Files
        var finalFiles: List<File> = emptyList()
        // Load Jasper Files
        val filePentests: File = ResourceUtils.getFile(reportPentestsDesignTemplate)
        // Compile Jasper Reports
        val jasperReportPentests: JasperReport = JasperCompileManager.compileReport(filePentests.absolutePath)
        // Create pentestReport content for every objective
        for (i in 0 until projectReportCollection.projectPentestReport.size) {
            val projectSinglePentestReportDataSource: JRBeanCollectionDataSource =
                JRBeanCollectionDataSource(mutableListOf(projectReportCollection.projectPentestReport[i]))
            // Setup Sub-dataset for Findings of Pentest
            val pentestFindingsDataSource: JRBeanCollectionDataSource =
                JRBeanCollectionDataSource(projectReportCollection.projectPentestReport[i].findings)
            // Setup Sub-dataset for Comments of Pentest
            // val pentestCommentsDataSource =
            // Setup Parameter & add Sub-datasets
            val parameters = HashMap<String, Any>()
            parameters["PentestFindingsDataSource"] = if (projectReportCollection.projectPentestReport[i].findings.isNotEmpty()) {
                JRBeanCollectionDataSource(projectReportCollection.projectPentestReport[i].findings)
            } else {
                JRBeanCollectionDataSource(emptyList<Finding>())
            }
            parameters["PentestCommentsDataSource"] = if (projectReportCollection.projectPentestReport[i].comments.isNotEmpty()) {
                JRBeanCollectionDataSource(projectReportCollection.projectPentestReport[i].comments)
            } else {
                JRBeanCollectionDataSource(emptyList<Comment>())
            }
            // Fill Reports
            // Print one report for each objective and merge them together afterwards
            val jasperPrintPentests: JasperPrint =
                JasperFillManager.fillReport(jasperReportPentests, parameters, projectSinglePentestReportDataSource)
            // Create File
            var finalFile: File = File(reportDefaultPdf)
            if (reportFormat.equals("pdf")) {
                JasperExportManager.exportReportToPdfFile(
                    jasperPrintPentests,
                    reportDestination + "E" + i.toString() + "_Pentestreport.pdf"
                )
                finalFile = File(reportDestination + "E" + i.toString() + "_Pentestreport.pdf")
                finalFiles += (finalFile)
            } else {
                // ToDo: Implement different report formats
                finalFiles += (finalFile)
            }
        }
        return finalFiles
    }

    private fun createAppendencies(reportFormat: String): File {
        // Load Jasper Files
        val fileCover: File = ResourceUtils.getFile(reportAppendenciesDesignTemplate)
        // Compile Jasper Reports
        val jasperReportCover: JasperReport = JasperCompileManager.compileReport(fileCover.absolutePath)
        // Setup Parameter & add Sub-datasets
        val parameters = HashMap<String, Any>()
        parameters["SeverityRatingDefinition"] = JREmptyDataSource()
        // Fill Reports
        val jasperPrintCover: JasperPrint =
            JasperFillManager.fillReport(jasperReportCover, parameters, JREmptyDataSource())
        // Create File
        var finalFile: File = File(reportDefaultPdf)
        return if (reportFormat.equals("pdf")) {
            JasperExportManager.exportReportToPdfFile(jasperPrintCover, reportDestination + "F_Appendencies.pdf")
            finalFile = File(reportDestination + "F_Appendencies.pdf")
            finalFile
        } else {
            // ToDo: Implement different report formats
            finalFile
        }
    }
}