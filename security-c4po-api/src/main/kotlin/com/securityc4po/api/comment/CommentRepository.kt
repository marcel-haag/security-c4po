package com.securityc4po.api.comment

import org.springframework.data.mongodb.repository.DeleteQuery
import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface CommentRepository : ReactiveMongoRepository<CommentEntity, String> {

    @Query("{'data._id' : ?0}")
    fun findCommentById(id: String): Mono<CommentEntity>

    @Query("{'data._id' :{\$in: ?0 }}")
    fun findCommentsByIds(id: List<String>): Flux<CommentEntity>

    @DeleteQuery("{'data._id' : ?0}")
    fun deleteCommentById(id: String): Mono<Long>
}