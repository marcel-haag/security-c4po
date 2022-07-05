package com.securityc4po.api.configuration.error.handler

import org.springframework.boot.web.error.ErrorAttributeOptions
import org.springframework.boot.web.reactive.error.DefaultErrorAttributes
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClientResponseException
import org.springframework.web.reactive.function.server.ServerRequest
import org.json.JSONObject

@Component
class GlobalErrorAttributes : DefaultErrorAttributes() {
    override fun getErrorAttributes(request: ServerRequest, options: ErrorAttributeOptions): Map<String, Any> {
        val map = super.getErrorAttributes(request, options)

        /////////////////////////
        ////// Exceptions ///////
        /////////////////////////

        if (getError(request) is EntityNotFoundException) {
            val ex = getError(request) as EntityNotFoundException
            map.put("message", ex.errormessage)
            map.put("errorcode", ex.errorcode.code)
            map.put("status", ex.status.value())
            map.put("error", ex.status.reasonPhrase)
            return map
        }

        if (getError(request) is EntityAlreadyChangedException) {
            val ex = getError(request) as EntityAlreadyChangedException
            map.put("message", ex.errormessage)
            map.put("errorcode", ex.errorcode.code)
            map.put("status", ex.status.value())
            map.put("error", ex.status.reasonPhrase)
            return map
        }

        if (getError(request) is InvalidModelException) {
            val ex = getError(request) as InvalidModelException
            map.put("message", ex.errormessage)
            map.put("errorcode", ex.errorcode.code)
            map.put("status", ex.status.value())
            map.put("error", ex.status.reasonPhrase)
            return map
        }

        if (getError(request) is UnauthorizedException) {
            val ex = getError(request) as UnauthorizedException
            map.put("message", ex.errormessage)
            map.put("errorcode", ex.errorcode.code)
            map.put("status", ex.status.value())
            map.put("error", ex.status.reasonPhrase)
            return map
        }

        if (getError(request) is TransactionInterruptedException) {
            val ex = getError(request) as TransactionInterruptedException
            map.put("message", ex.errormessage)
            map.put("errorcode", ex.errorcode.code)
            map.put("status", ex.status.value())
            map.put("error", ex.status.reasonPhrase)
            return map
        }

        if (getError(request) is WebClientResponseException) {
            val ex = getError(request) as WebClientResponseException
            val body = JSONObject(ex.responseBodyAsString)
            map.put("message", body.get("message"))
            map.put("errorcode", body.get("errorcode"))
            map.put("status", ex.rawStatusCode)
            map.put("error", ex.statusText)
            return map
        }

        map.put("message", map["message"])
        map.put("status", map["status"] as Int)
        map.put("error", map["error"])
        return map
    }
}