package com.securityc4po.api.project

import com.securityc4po.api.extensions.getLoggerFor
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class ProjectService(private val projectRepository: ProjectRepository) {

    var logger = getLoggerFor<ProjectService>()

    /**
     * Get all [Project]s
     *
     * @return list of [Project]
     */
    fun getProjects(): Mono<List<Project>> {
        return projectRepository.findAll().collectList().map {
            it.map { projectEntity -> projectEntity.toProject() }
        }
    }
}
