package com.securityc4po.api.project

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION, MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION)
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
