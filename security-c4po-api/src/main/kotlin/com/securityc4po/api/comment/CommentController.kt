package com.securityc4po.api.comment

import com.securityc4po.api.configuration.BC_BAD_CAST_TO_ABSTRACT_COLLECTION
import com.securityc4po.api.extensions.getLoggerFor
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import com.securityc4po.api.ResponseBody
import com.securityc4po.api.configuration.error.handler.EntityNotFoundException
import com.securityc4po.api.configuration.error.handler.Errorcode
import com.securityc4po.api.finding.toFindingResponseBody
import com.securityc4po.api.pentest.PentestService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.noContent
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

@RestController
@RequestMapping("/pentests")
@CrossOrigin(
    origins = [],
    allowCredentials = "false",
    allowedHeaders = ["*"],
    methods = [RequestMethod.GET, RequestMethod.DELETE, RequestMethod.POST, RequestMethod.PATCH]
)
@SuppressFBWarnings(BC_BAD_CAST_TO_ABSTRACT_COLLECTION)
class CommentController(private val pentestService: PentestService, private val commentService: CommentService) {

    var logger = getLoggerFor<CommentController>()

    @GetMapping("/{pentestId}/comments")
    fun getComments(@PathVariable(value = "pentestId") pentestId: String): Mono<ResponseEntity<List<ResponseBody>>> {
        return this.pentestService.getCommentIdsByPentestId(pentestId).flatMap { commentIds: List<String> ->
            this.commentService.getCommentsByIds(commentIds).map { commentList ->
                commentList.map { it.toCommentResponseBody() }
            }
        }.map {
            if (it.isEmpty()) noContent().build()
            else ResponseEntity.ok(it)
        }
    }

    @PostMapping("/{pentestId}/comment")
    fun saveComment(
        @PathVariable(value = "pentestId") pentestId: String,
        @RequestBody body: CommentRequestBody
    ): Mono<ResponseEntity<ResponseBody>> {
        return this.commentService.saveComment(pentestId, body).map {
            ResponseEntity.accepted().body(it.toCommentResponseBody())
        }
    }
}