package com.securityc4po.reporting.configuration.error.handler

import org.springframework.boot.autoconfigure.web.ResourceProperties
import org.springframework.boot.autoconfigure.web.reactive.error.AbstractErrorWebExceptionHandler
import org.springframework.boot.web.error.ErrorAttributeOptions
import org.springframework.boot.web.reactive.error.ErrorAttributes
import org.springframework.context.ApplicationContext
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.codec.ServerCodecConfigurer
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.server.*
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono

@Component
@Order(-2)
class GlobalErrorWebExceptionHandler(g: GlobalErrorAttributes, applicationContext: ApplicationContext,
    serverCodecConfigurer: ServerCodecConfigurer
) : AbstractErrorWebExceptionHandler(g, ResourceProperties(), applicationContext) {

    init {
        super.setMessageWriters(serverCodecConfigurer.writers)
        super.setMessageReaders(serverCodecConfigurer.readers)
    }

    override fun getRoutingFunction(errorAttributes: ErrorAttributes): RouterFunction<ServerResponse> {
        return RouterFunctions.route(RequestPredicates.all(), HandlerFunction { this.renderErrorResponse(it) })
    }

    private fun renderErrorResponse(request: ServerRequest): Mono<ServerResponse> {
        val errorPropertiesMap = getErrorAttributes(request, ErrorAttributeOptions.defaults())
        return ServerResponse.status(HttpStatus.valueOf(errorPropertiesMap["status"] as Int))
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(errorPropertiesMap))
    }
}

open class C4POBaseException (val errorcode: Errorcode, httpStatus: HttpStatus): ResponseStatusException(httpStatus)
internal class EntityNotFoundException(val errormessage: String, code: Errorcode): C4POBaseException(code, HttpStatus.NOT_FOUND)
internal class UnauthorizedException (val errormessage: String, code: Errorcode) : C4POBaseException(code, HttpStatus.UNAUTHORIZED)
internal class TransactionInterruptedException(val errormessage: String, code: Errorcode): C4POBaseException(code, HttpStatus.FAILED_DEPENDENCY)

/**
 * This method is used to throw an exception, and log a message if needed, if a certain condition is true.
 *
 * @param require of type boolean. It is the condition to check on.
 * @param logging lambda expression for optional logging.
 * @param mappedException of type OpenSpaceBaseException.
 */
inline fun validate(require: Boolean, logging: () -> Unit, mappedException: C4POBaseException) {
    if (!require) {
        throw wrappedException(logging= { logging() }, mappedException = mappedException)
    }
}

/**
 * This method is used to reduce some lines of code when we throw an exception.
 * It has an optional logging part using a lambda expression.
 *
 * @param logging lambda expression for optional logging.
 * @param mappedException of type OpenSpaceBaseException.
 */
inline fun wrappedException(logging: () -> Unit, mappedException: C4POBaseException): C4POBaseException {
    logging()
    return mappedException
}
