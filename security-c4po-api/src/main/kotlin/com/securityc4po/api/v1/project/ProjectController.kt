package com.securityc4po.api.v1.project

import com.securityc4po.api.v1.ResponseBody
import com.securityc4po.api.v1.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.v1.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/projects")
@CrossOrigin(
        origins = [],
        allowCredentials = "false",
        allowedHeaders = ["*"],
        methods = [RequestMethod.GET]
)
@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION)
class ProjectController(private val projectService: ProjectService) {

    var logger = getLoggerFor<ProjectController>()

    @GetMapping
    fun getProjects(): List<Project> {
        return projectService.getProjects()
    }

}