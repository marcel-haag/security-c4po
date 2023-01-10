package com.securityc4po.reporting.http

import com.securityc4po.reporting.extensions.getLoggerFor
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import org.springframework.web.server.WebFilter

@Component
class RequestLogInterceptor {
    private val logger = getLoggerFor<RequestLogInterceptor>()

    @Bean
    fun loggingFilter(): WebFilter =
        WebFilter { exchange, chain ->
            val request = exchange.request
            if (request.headers.getFirst(ApplicationHeaders.AUTHORIZATION) == null) {
                logger.warn("No Authorization header present for request: ${request.id}")
            }
            logger.info(
                "Request recognized: [id: ${request.id}, method=${request.method}, " +
                        "path=${request.path.pathWithinApplication()}, params=[${request.queryParams}] }"
            )
            val result = chain.filter(exchange)
            return@WebFilter result
        }
}
