package com.securityc4po.api.http

import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@Component
class AddResponseHeaderFilter: WebFilter {

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        val httpHeaders: HashMap<String, String> = HashMap()
        httpHeaders.put("Application-Name", ApplicationHeaders.APPLICATION_NAME)
        httpHeaders.put("X-Version", ApplicationHeaders.XVERSION.toString())

        return chain.filter(
                exchange.apply {
                    response.headers.setAll(httpHeaders)
                }
        )
    }
}
