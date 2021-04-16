package com.securityc4po.api.configuration.security

import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono

@Service
class UserAccountDetailsService : ReactiveUserDetailsService {

    override fun findByUsername(username: String): Mono<UserDetails> {
        return Appuser().toMono()
    }
}
