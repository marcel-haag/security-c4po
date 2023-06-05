package com.securityc4po.api.project

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import com.securityc4po.api.ResponseBody
import com.securityc4po.api.configuration.security.Appuser
import com.securityc4po.api.pentest.PentestDeletionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import org.springframework.security.core.annotation.AuthenticationPrincipal

@RestController
@RequestMapping("/projects")
@CrossOrigin(
        origins = [],
        allowCredentials = "false",
        allowedHeaders = ["*"],
        methods = [RequestMethod.GET, RequestMethod.DELETE, RequestMethod.POST, RequestMethod.PATCH]
)
@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION)
class ProjectController(private val projectService: ProjectService, private val pentestDeletionService: PentestDeletionService) {

    var logger = getLoggerFor<ProjectController>()

    @GetMapping
    fun getProjects(
        @AuthenticationPrincipal user: Appuser
    ): Mono<ResponseEntity<List<ResponseBody>>> {

        println("controller " + user.getSub())
        return projectService.getProjects(user.getSub()).map { projectList ->
            projectList.map {
                it.toProjectResponseBody()
            }
        }.map {
            if (it.isEmpty()) ResponseEntity.noContent().build()
            else ResponseEntity.ok(it)
        }
    }

    @GetMapping("/{projectId}")
    fun getCompletedProjectById(
        @PathVariable(value = "projectId") projectId: String,
        @AuthenticationPrincipal user: Appuser
    ): Mono<ResponseEntity<ResponseBody>> {
        return projectService.getProjectById(projectId, user.getSub()).map {
            it.toProjectCompletedPentestResponseBody()
        }.map {
            if (it.isEmpty()) ResponseEntity.noContent().build()
            else ResponseEntity.ok(it)
        }
    }

    @GetMapping("/evaluation/{projectId}")
    fun getProjectById(
        @PathVariable(value = "projectId") projectId: String,
        @AuthenticationPrincipal user: Appuser
    ): Mono<ResponseEntity<ResponseBody>> {
        return projectService.getProjectById(projectId, user.getSub()).map {
            it.toProjectEvaluatedPentestResponseBody()
        }.map {
            if (it.isEmpty()) ResponseEntity.noContent().build()
            else ResponseEntity.ok(it)
        }
    }

    @PostMapping
    fun saveProject(
        @RequestBody body: ProjectRequestBody,
        @AuthenticationPrincipal user: Appuser
    ): Mono<ResponseEntity<ResponseBody>> {
        return this.projectService.saveProject(body, user.getSub()).map {
            ResponseEntity.accepted().body(it.toProjectResponseBody())
        }
    }

    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable(value = "id") id: String): Mono<ResponseEntity<ResponseBody>> {
        return this.projectService.deleteProject(id).flatMap { project: Project ->
            // If the project has pentest they will be deleted as well as all associated findings & comments
            if (project.projectPentests.isNotEmpty()) {
                this.pentestDeletionService.deletePentestsAndAllAssociatedFindingsAndComments(project).collectList()
                    .flatMap {
                        Mono.just(ResponseEntity.ok().body(project.toProjectDeleteResponseBody()))
                    }
            } else {
                Mono.just(ResponseEntity.ok().body(project.toProjectDeleteResponseBody()))
            }
        }.switchIfEmpty {
            Mono.just(ResponseEntity.noContent().build<ResponseBody>())
        }
    }

    @PatchMapping("/{id}")
    fun updateProject(
        @PathVariable(value = "id") id: String,
        @AuthenticationPrincipal user: Appuser,
        @RequestBody body: ProjectRequestBody
    ): Mono<ResponseEntity<ResponseBody>> {
        return this.projectService.updateProject(id, body, user.getSub()).map {
            ResponseEntity.accepted().body(it.toProjectResponseBody())
        }
    }
}
