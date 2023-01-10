package com.securityc4po.reporting.remote

import com.securityc4po.reporting.http.ApplicationHeaders
import com.securityc4po.reporting.remote.model.ProjectReport
import org.springframework.core.ParameterizedTypeReference
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.util.UriComponentsBuilder
import reactor.core.publisher.Mono

@Component
class APIClient(
    private val apiClientCfg: APIClientCfg,
    private val webClientBuilder: WebClient.Builder
) {

    private val webClient by lazy {
        webClientBuilder
            .baseUrl(apiClientCfg.url.toString())
            .defaultHeader("Application-Name", ApplicationHeaders.APPLICATION_NAME)
            .build()
    }

    /**
     * Retrieves the [ProjectReport] data from api service getProjectReportDataById()
     *
     * @param projectId String id
     * @param token of String
     * @return of [ProjectReport]
     */
    fun retrieveProjectDataById(projectId: String, token: String): Mono<ProjectReport> {
        val projectByProjectIdUriBuilder = UriComponentsBuilder
            .fromPath(apiClientCfg.projectReport.path)
            .queryParam("projectId", projectId)

        return webClient.get()
            .uri(projectByProjectIdUriBuilder.toUriString())
            .headers {
                it.add(ApplicationHeaders.AUTHORIZATION, "Bearer $token")
            }
            .retrieve()
            .bodyToMono(object : ParameterizedTypeReference<ProjectReport>() {})
    }
}
