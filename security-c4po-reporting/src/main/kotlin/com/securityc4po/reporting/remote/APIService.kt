package com.securityc4po.reporting.remote

import com.securityc4po.reporting.remote.model.ProjectReport
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class APIService(private val apiClient: APIClient) {

    /**
     *  Requests the project data by id
     *
     *  @param id of String
     *  @param token of String
     *  @return [ProjectReport]
     */
    fun requestProjectDataById(projectId: String, token: String): Mono<ProjectReport> {
        return apiClient.retrieveProjectDataById(projectId, token)
    }
}
