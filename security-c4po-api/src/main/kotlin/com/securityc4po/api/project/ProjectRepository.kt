package com.securityc4po.api.project

import org.springframework.data.mongodb.repository.DeleteQuery
import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ProjectRepository: ReactiveMongoRepository<ProjectEntity, String> {

    @Query("{'data._id' : ?0}")
    fun findProjectById(id: String): Mono<ProjectEntity>

    @DeleteQuery("{'data._id' : ?0}")
    fun deleteProjectById(id: String): Mono<Long>


}