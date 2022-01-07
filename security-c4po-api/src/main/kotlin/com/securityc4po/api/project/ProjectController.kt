package com.securityc4po.api.project

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import com.securityc4po.api.ResponseBody
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/projects")
@CrossOrigin(
        origins = [],
        allowCredentials = "false",
        allowedHeaders = ["*"],
        methods = [RequestMethod.GET, RequestMethod.POST]
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
            ResponseEntity.ok(it)
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
}
