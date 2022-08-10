package com.securityc4po.api.project

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import com.securityc4po.api.ResponseBody
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

@RestController
@RequestMapping("/projects")
@CrossOrigin(
        origins = [],
        allowCredentials = "false",
        allowedHeaders = ["*"],
        methods = [RequestMethod.GET, RequestMethod.DELETE, RequestMethod.POST, RequestMethod.PATCH]
)

@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION)
class ProjectController(private val projectService: ProjectService) {

    var logger = getLoggerFor<ProjectController>()

    @GetMapping
    fun getProjects(): Mono<ResponseEntity<List<ResponseBody>>> {
        return projectService.getProjects().map { projectList ->
            projectList.map {
                it.toProjectResponseBody()
            }
        }.map {
            if (it.isEmpty()) ResponseEntity.noContent().build()
            else ResponseEntity.ok(it)
        }
    }

    @PostMapping
    fun saveProject(
        @RequestBody body: ProjectRequestBody
    ): Mono<ResponseEntity<ResponseBody>> {
        return this.projectService.saveProject(body).map {
            ResponseEntity.accepted().body(it.toProjectResponseBody())
        }
    }

    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable(value = "id") id: String): Mono<ResponseEntity<ResponseBody>> {
        return this.projectService.deleteProject(id).map{
            ResponseEntity.ok().body(it.toProjectDeleteResponseBody())
        }.switchIfEmpty {
            Mono.just(ResponseEntity.noContent().build<ResponseBody>())
        }
    }

    @PatchMapping("/{id}")
    fun updateProject(
        @PathVariable(value = "id") id: String,
        @RequestBody body: ProjectRequestBody
    ): Mono<ResponseEntity<ResponseBody>> {
        return this.projectService.updateProject(id, body).map {
            ResponseEntity.accepted().body(it.toProjectResponseBody())
        }
    }
}
