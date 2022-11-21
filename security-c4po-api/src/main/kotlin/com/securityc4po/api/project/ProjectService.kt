package com.securityc4po.api.project

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.error.handler.*
import com.securityc4po.api.configuration.error.handler.EntityNotFoundException
import com.securityc4po.api.configuration.error.handler.InvalidModelException
import com.securityc4po.api.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import java.time.Instant

@Service
@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION, MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION)
class ProjectService(private val projectRepository: ProjectRepository) {

    var logger = getLoggerFor<ProjectService>()

    /**
     * Get all [Project]s
     *
     * @throws [EntityNotFoundException] if there are no [Project]s in collection
     * @return list of [Project]
     */
    fun getProjects(): Mono<List<Project>> {
        return projectRepository.findAll().collectList().map {
            it.map { projectEntity -> projectEntity.toProject() }
        }.switchIfEmpty {
            val msg = "Projects not found."
            val ex = EntityNotFoundException(msg, Errorcode.ProjectsNotFound)
            logger.warn(msg, ex)
            throw ex
        }
    }

    /**
     * Save [Project]
     *
     * @throws [InvalidModelException] if the [Project] is invalid
     * @throws [TransactionInterruptedException] if the [Project] could not be stored
     * @return saved [Project]
     */
    fun saveProject(body: ProjectRequestBody): Mono<Project> {
        validate(
            require = body.isValid(),
            logging = { logger.warn("Project not valid.") },
            mappedException = InvalidModelException(
                "Project not valid.", Errorcode.ProjectInvalid
            )
        )
        val project = body.toProject()
        val projectEntity = ProjectEntity(project)
        return projectRepository.insert(projectEntity).map {
            it.toProject()
        }.doOnError {
            throw wrappedException(
                logging = { logger.warn("Project could not be stored in Database. Thrown exception: ", it) },
                mappedException = TransactionInterruptedException(
                    "Project could not be stored.",
                    Errorcode.ProjectInsertionFailed
                )
            )
        }
    }

    /**
     * Delete [Project]
     *
     * @throws [TransactionInterruptedException] if the [Project] could not be deleted
     * @return status code of deleted [Project]
     */
    fun deleteProject(id: String): Mono<Project> {
        return projectRepository.findProjectById(id).switchIfEmpty {
            logger.info("Project with id $id not found. Deletion not necessary.")
            Mono.empty()
        }.flatMap { projectEntity: ProjectEntity ->
            val project = projectEntity.toProject()
            projectRepository.deleteProjectById(id).map { project }
        }.onErrorMap {
            TransactionInterruptedException(
                "Deleting Project failed!",
                Errorcode.ProjectDeletionFailed
            )
        }
    }

    /**
     * Update [Project]
     *
     * @throws [InvalidModelException] if the [Project] is invalid
     * @throws [TransactionInterruptedException] if the [Project] could not be updated
     * @return updated [Project]
     */
    fun updateProject(id: String, body: ProjectRequestBody): Mono<Project> {
        validate(
            require = body.isValid(),
            logging = { logger.warn("Project not valid.") },
            mappedException = InvalidModelException(
                "Project not valid.", Errorcode.ProjectInvalid
            )
        )
        return projectRepository.findProjectById(id).switchIfEmpty {
            logger.warn("Project with id $id not found. Updating not possible.")
            val msg = "Project with id $id not found."
            val ex = EntityNotFoundException(msg, Errorcode.ProjectNotFound)
            throw ex
        }.flatMap { projectEntity: ProjectEntity ->
            projectEntity.lastModified = Instant.now()
            projectEntity.data = buildProject(body, projectEntity)
            projectRepository.save(projectEntity).map {
                it.toProject()
            }.doOnError {
                throw wrappedException(
                    logging = { logger.warn("Project could not be updated in Database. Thrown exception: ", it) },
                    mappedException = TransactionInterruptedException(
                        "Project could not be updated.",
                        Errorcode.ProjectInsertionFailed
                    )
                )
            }
        }
    }


    /**
     * Update testing progress for specific Pentest of [Project]
     *
     * @throws [TransactionInterruptedException] if the [Project] Pentest could not be updated
     * @return updated [Project]
     */
    fun updateProjectTestingProgress(
        projectId: String,
        projectPentest: ProjectPentest
    ): Mono<Project> {
        return this.projectRepository.findProjectById(projectId).switchIfEmpty {
            logger.warn("Project with id $projectId not found. Updating not possible.")
            val msg = "Project with id $projectId not found."
            val ex = EntityNotFoundException(msg, Errorcode.ProjectNotFound)
            throw ex
        }.flatMap {projectEntity: ProjectEntity ->
            val currentProjectPentestStatus = projectEntity.data.projectPentests.find { projectPentestData -> projectPentestData.pentestId == projectPentest.pentestId }
            if (currentProjectPentestStatus != null) {
                projectEntity.data.projectPentests.find { data -> data.pentestId == projectPentest.pentestId }!!.status = projectPentest.status
            } else {
                projectEntity.data.projectPentests += projectPentest
            }
            projectEntity.lastModified = Instant.now()
            this.projectRepository.save(projectEntity).map {
                it.toProject()
            }.doOnError {
                throw wrappedException(
                    logging = { logger.warn("Project Pentests could not be updated or saved in Database. Thrown exception: ", it) },
                    mappedException = TransactionInterruptedException(
                        "Project could not be updated.",
                        Errorcode.ProjectInsertionFailed
                    )
                )
            }
        }
    }
}
