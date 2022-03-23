package com.securityc4po.api.project

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import java.time.Instant
import java.util.*


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

    fun saveProject(body: ProjectRequestBody): Mono<Project> {
        val project = body.toProject()
        val projectEntity = ProjectEntity(project)
        return projectRepository.insert(projectEntity).map {
            it.toProject()
        }.doOnError {
            logger.warn("Project could not be stored in Database. Thrown exception: ", it)
        }
    }

    fun deleteProject(id: String): Mono<Project> {
        return projectRepository.findProjectById(id).switchIfEmpty{
            logger.info("Project with id $id not found. Deletion not possible.")
            Mono.empty()
        }.flatMap{ projectEntity: ProjectEntity ->
            val project = projectEntity.toProject()
            projectRepository.deleteProjectById(id).map{project}
        }
    }

    fun updateProject(id: String, body: ProjectRequestBody): Mono<Project> {
        return projectRepository.findProjectById(id).switchIfEmpty{
            logger.info("Project with id $id not found. Updating not possible.")
            Mono.empty()
        }.flatMap{projectEntity: ProjectEntity ->
            projectEntity.lastModified = Instant.now()
            projectEntity.data = buildProject(body, projectEntity)
            projectRepository.save(projectEntity).map{
                it.toProject()
            }.doOnError {
                logger.warn("Project could not be updated in Database. Thrown exception: ", it)
            }
        }
    }
}

private fun buildProject(body: ProjectRequestBody, projectEntity: ProjectEntity): Project{
    return Project(
        id = projectEntity.data.id,
        client = body.client,
        title = body.title,
        createdAt = projectEntity.data.createdAt,
        tester = body.tester,
        createdBy = projectEntity.data.createdBy
    )
}