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
}