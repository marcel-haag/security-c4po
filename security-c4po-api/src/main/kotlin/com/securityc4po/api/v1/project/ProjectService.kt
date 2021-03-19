package com.securityc4po.api.v1.project

import com.securityc4po.api.v1.extensions.getLoggerFor
import org.junit.BeforeClass
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
/* Remove after database is integrated */
import java.io.File
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule

@Service
class ProjectService() {

    var logger = getLoggerFor<ProjectService>()

    /* Remove after database is integrated */
    val mapper = jacksonObjectMapper()

    @BeforeClass
    fun init() {
        mapper.registerKotlinModule()
        mapper.registerModule(JavaTimeModule())
    }


    /**
     * Get all [Project]s
     *
     * @return list of [Project]
     */
    fun getProjects(): List<Project> {
        val jsonProjectsString: String = File("./src/main/resources/mocks/projects.json").readText(Charsets.UTF_8)
        val jsonProjectList: List<Project> = mapper.readValue<List<Project>>(jsonProjectsString)
        /* After database integration the return should be Flux of ProjectEntity */
        return jsonProjectList;
    }
}