package com.securityc4po.api.project

import com.securityc4po.api.BaseEntity

/*
 *  @Document(collection = "project")
 *  Can be used after adding deps for mongodb
*/
open class ProjectEntity(
        data: Project
) : BaseEntity<Project>(data)
