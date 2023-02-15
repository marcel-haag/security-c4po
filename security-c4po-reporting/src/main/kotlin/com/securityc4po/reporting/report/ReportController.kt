package com.securityc4po.reporting.report

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.securityc4po.reporting.configuration.security.Appuser
import com.securityc4po.reporting.extensions.getLoggerFor
import com.securityc4po.reporting.remote.APIService
import com.securityc4po.reporting.remote.model.ProjectReport
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.notFound
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import java.io.File

@RestController
@RequestMapping("/reports")
@CrossOrigin(
    origins = [],
    allowCredentials = "false",
    allowedHeaders = ["*"],
    methods = [RequestMethod.GET]
)
class ReportController(private val apiService: APIService, private val reportService: ReportService) {

    var logger = getLoggerFor<ReportController>()

    @GetMapping(
        "/{projectId}/pdf",
        produces = [MediaType.APPLICATION_PDF_VALUE]
    )
    fun downloadPentestReportPDF(@PathVariable(value = "projectId") projectId: String, @AuthenticationPrincipal user: Appuser): Mono<ResponseEntity<ByteArray>> {
        // Todo: Create Report with Jasper
        // this.apiService.requestProjectDataById(projectId, user.token)
        val jsonProjectReportString: String =
            File("./src/test/resources/ProjectReportData.json").readText(Charsets.UTF_8)
        val jsonProjectReportCollection: ProjectReport =
            jacksonObjectMapper().readValue<ProjectReport>(jsonProjectReportString)
        // Setup headers
        return this.reportService.createReport(jsonProjectReportCollection, "pdf").map { reportClassLoaderFilePath ->
            ResponseEntity.ok().body(reportClassLoaderFilePath)
        }.switchIfEmpty {
            Mono.just(notFound().build<ByteArray>())
        }.doOnSuccess {
            this.reportService.cleanUpFiles()
        }
    }

    // ToDo: Add download API for csv report
    /*
    @GetMapping(
        "/{projectId}/csv",
        produces = ["text/csv"]
    )
    fun downloadPentestReportCSV() {}
    */
    // ToDo: Add download API for html report
    /*
    @GetMapping(
        "/{projectId}/html",
        produces = ["text/html"]
    )
    fun downloadPentestReportHTML() {}
    */
}
