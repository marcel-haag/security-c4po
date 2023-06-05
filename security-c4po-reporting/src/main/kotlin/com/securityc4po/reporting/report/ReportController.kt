package com.securityc4po.reporting.report

import com.securityc4po.reporting.configuration.security.Appuser
import com.securityc4po.reporting.extensions.getLoggerFor
import com.securityc4po.reporting.remote.APIService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.notFound
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

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
        "/{projectId}/pdf/{reportLanguage}",
        produces = [MediaType.APPLICATION_PDF_VALUE]
    )
    fun downloadPentestReportPDF(
        @PathVariable(value = "projectId") projectId: String,
        @PathVariable(value = "reportLanguage") reportLanguage: String,
        @AuthenticationPrincipal user: Appuser
    ): Mono<ResponseEntity<ByteArray>> {
        return this.apiService.requestProjectReportDataById(projectId, user.token).flatMap {projectReport ->
            this.reportService.createReport(projectReport, "pdf", reportLanguage).map { reportClassLoaderFilePath ->
                ResponseEntity.ok().body(reportClassLoaderFilePath)
            }.switchIfEmpty {
                Mono.just(notFound().build<ByteArray>())
            }
        }
    }
}
