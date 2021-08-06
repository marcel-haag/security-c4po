package com.securityc4po.api.project

import com.securityc4po.api.BaseEntity
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
                this.data.logo
        )
}

fun List<ProjectEntity>.toProjects(): List<Project> {
        return this.map {
                it.toProject()
        }
}
