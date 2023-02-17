package com.securityc4po.reporting.remote

import com.securityc4po.reporting.extensions.getLoggerFor
import com.securityc4po.reporting.remote.model.*
import com.securityc4po.reporting.remote.model.api.*
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class APIService(private val apiClient: APIClient) {

    var logger = getLoggerFor<APIService>()

    /**
     *  Requests the complete project report data by project id
     *
     *  @param id of String
     *  @param token of String
     *  @return [ProjectReport]
     */
    fun requestProjectReportDataById(projectId: String, token: String): Mono<ProjectReport> {
        var completedProjectReport: ProjectReport
        return this.requestProjectDataById(projectId, token).flatMap { project: Project ->
            // Setup completed [ProjectReport] object
            completedProjectReport = project.toProjectReport()
            // Request completed pentest data and add id to [ProjectReport] object
            project.projectPentests?.let {
                Flux.fromIterable(it.asIterable()).parallel().flatMap { projectPentest ->
                    this.requestPentestDataById(projectPentest.pentestId, token).map { completedPentest ->
                        completedPentest
                    }
                }.sequential().collectList()
            }?.map {
                completedProjectReport.projectPentestReport.addAll(it)
                completedProjectReport
            } ?: Mono.just(completedProjectReport)
        }
    }

    /**
     *  Requests the project data by id
     *
     *  @param id of String
     *  @param token of String
     *  @return [Project]
     */
    fun requestProjectDataById(projectId: String, token: String): Mono<Project> {
        return apiClient.retrieveProjectDataById(projectId, token)
    }

    /**
     *  Requests the pentest report data by pentest id
     *
     *  @param id of String
     *  @param token of String
     *  @return [PentestReport]
     */
    fun requestPentestDataById(pentestId: String, token: String): Mono<PentestReport> {
        return apiClient.retrievePentestDataById(pentestId, token)
    }
}
