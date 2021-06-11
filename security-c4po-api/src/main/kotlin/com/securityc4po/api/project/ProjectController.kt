package com.securityc4po.api.project

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import com.securityc4po.api.ResponseBody
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/projects")
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
