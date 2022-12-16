package com.securityc4po.api.comment

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.configuration.error.handler.*
import com.securityc4po.api.configuration.error.handler.EntityNotFoundException
import com.securityc4po.api.configuration.error.handler.InvalidModelException
import com.securityc4po.api.configuration.error.handler.TransactionInterruptedException
import com.securityc4po.api.extensions.getLoggerFor
import com.securityc4po.api.finding.*
import com.securityc4po.api.pentest.PentestService
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

@Service
@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION, MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION)
class CommentService(private val commentRepository: CommentRepository, private val pentestService: PentestService) {

    var logger = getLoggerFor<CommentService>()

    /**
     * Save [Finding]
     *
     * @throws [InvalidModelException] if the [Finding] is invalid
     * @throws [TransactionInterruptedException] if the [Finding] could not be stored
     * @return saved [Finding]
     */
    fun saveComment(pentestId: String, body: CommentRequestBody): Mono<Comment> {
        validate(
            require = body.isValid(),
            logging = { logger.warn("Comment not valid.") },
            mappedException = InvalidModelException(
                "Comment not valid.", Errorcode.CommentInvalid
            )
        )
        val comment = body.toComment()
        val commentEntity = CommentEntity(comment)
        return commentRepository.insert(commentEntity).flatMap { newCommentEntity: CommentEntity ->
            val finding = newCommentEntity.toComment()
            // After successfully saving finding add id to pentest
            pentestService.updatePentestComment(pentestId, comment.id).onErrorMap {
                TransactionInterruptedException(
                    "Pentest could not be updated in Database.",
                    Errorcode.PentestInsertionFailed
                )
            }.map {
                finding
            }
        }.doOnError {
            throw wrappedException(
                logging = { logger.warn("Comment could not be stored in Database. Thrown exception: ", it) },
                mappedException = TransactionInterruptedException(
                    "Comment could not be stored.",
                    Errorcode.CommentInsertionFailed
                )
            )
        }
    }

    /**
     * Get all [Comments]s by commentId's
     *
     * @return list of [Comment]s
     */
    fun getCommentsByIds(commentIds: List<String>): Mono<List<Comment>> {
        return commentRepository.findCommentsByIds(commentIds).collectList().map {
            it.map { commentEntity -> commentEntity.toComment() }
        }.switchIfEmpty {
            val msg = "Comment not found."
            val ex = EntityNotFoundException(msg, Errorcode.CommentsNotFound)
            logger.warn(msg, ex)
            throw ex
        }
    }
}