package com.securityc4po.api.finding

import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface FindingRepository : ReactiveMongoRepository<FindingEntity, String> {

    @Query("{'data._id' : ?0}")
    fun findFindingById(id: String): Mono<FindingEntity>

    @Query("{'data._id' :{\$in: ?0 }}")
    fun findFindingsByIds(id: List<String>): Flux<FindingEntity>
}
