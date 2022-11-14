package com.securityc4po.api.finding

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.error.handler.*
import com.securityc4po.api.configuration.error.handler.InvalidModelException
import com.securityc4po.api.configuration.error.handler.TransactionInterruptedException
import com.securityc4po.api.extensions.getLoggerFor
import com.securityc4po.api.pentest.PentestService
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

@Service
@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION, MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION)
class FindingService(private val findingRepository: FindingRepository, private val pentestService: PentestService) {

    var logger = getLoggerFor<FindingService>()

    /**
     * Save [Finding]
     *
     * @throws [InvalidModelException] if the [Finding] is invalid
     * @throws [TransactionInterruptedException] if the [Finding] could not be stored
     * @return saved [Finding]
     */
    fun saveFinding(pentestId: String, body: FindingRequestBody): Mono<Finding> {
        validate(
            require = body.isValid(),
            logging = { logger.warn("Finding not valid.") },
            mappedException = InvalidModelException(
                "Finding not valid.", Errorcode.FindingInvalid
            )
        )
        val finding = body.toFinding()
        val findingEntity = FindingEntity(finding)
        return findingRepository.insert(findingEntity).flatMap { newFindingEntity: FindingEntity ->
            val finding = newFindingEntity.toFinding()
            // After successfully saving finding add id to pentest
            pentestService.updatePentestFinding(pentestId, finding.id).onErrorMap {
                TransactionInterruptedException(
                    "Pentest could not be updated in Database.",
                    Errorcode.PentestInsertionFailed
                )
            }.map {
                finding
            }
        }.doOnError {
            throw wrappedException(
                logging = { logger.warn("Finding could not be stored in Database. Thrown exception: ", it) },
                mappedException = TransactionInterruptedException(
                    "Finding could not be stored.",
                    Errorcode.FindingInsertionFailed
                )
            )
        }
    }

    /**
     * Get [Finding] by findingId
     *
     * @return of [Finding]
     */
    fun getFindingById(findingId: String): Mono<Finding> {
        return this.findingRepository.findFindingById(findingId).switchIfEmpty {
            logger.warn("Finding with id $findingId not found.")
            val msg = "Finding with id $findingId not found."
            val ex = EntityNotFoundException(msg, Errorcode.FindingNotFound)
            throw ex
        }.map { it.toFinding() }
    }

    /**
     * Get all [Finding]s by findingsId's
     *
     * @return list of [Finding]s
     */
    fun getFindingsByIds(findingIds: List<String>): Mono<List<Finding>> {
        return findingRepository.findFindingsByIds(findingIds).collectList().map {
            it.map { findingEntity -> findingEntity.toFinding() }
        }.switchIfEmpty {
            val msg = "Findings not found."
            val ex = EntityNotFoundException(msg, Errorcode.FindingsNotFound)
            logger.warn(msg, ex)
            throw ex
        }
    }
}