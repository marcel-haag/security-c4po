package com.securityc4po.api.project

import com.securityc4po.api.BaseEntity
import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "projects")
open class ProjectEntity(
        data: Project
) : BaseEntity<Project>(data)

fun ProjectEntity.toProject() : Project {
        return Project(
                this.data.id,
                this.data.client,
                this.data.title,
                this.data.createdAt,
                this.data.tester,
                this.data.summary,
                this.data.state,
                this.data.version,
                this.data.projectPentests,
                this.data.createdBy
        )
}

@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION, MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION)
fun List<ProjectEntity>.toProjects(): List<Project> {
        return this.map {
                it.toProject()
        }
}
