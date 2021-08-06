package com.securityc4po.api.configuration.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.core.convert.converter.Converter
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.Jwt
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import java.util.stream.Collectors

/** JWT converter that takes the roles from 'groups' claim of JWT token.  */
class AppuserJwtAuthConverter : Converter<Jwt, Mono<AbstractAuthenticationToken>> {

    override fun convert(jwt: Jwt): Mono<AbstractAuthenticationToken> {
        val authorities = extractAuthorities(jwt)
        val sub = extractSub(jwt)
        val username = extractUserName(jwt)
        return UsernamePasswordAuthenticationToken(Appuser(sub, username, jwt.tokenValue!!), "n/a", authorities).toMono()
    }

    private fun extractSub(jwt: Jwt): String {
        val sub = jwt.getClaims().get(SUB).toString()
        if (sub.isEmpty() || sub.equals("null")) {
            return "n/a"
        }
        return sub
    }

    private fun extractUserName(jwt: Jwt): String {
        val username = jwt.getClaims().get(USERNAME).toString()
        if (username.isEmpty() || username.equals("null")) {
            return "n/a"
        }
        return username
    }

    private fun extractAuthorities(jwt: Jwt): Collection<GrantedAuthority> {
        return this.getScopes(jwt).stream().map { authority ->
            ROLE_PREFIX + authority.toUpperCase()
        }.map {
            SimpleGrantedAuthority(it)
        }.collect(Collectors.toList())
    }

    private fun getScopes(jwt: Jwt): Collection<String> {
        val mapper = ObjectMapper()
        val scopes = jwt.getClaims().get(GROUPS_CLAIM).toString()
        val roleStringValue = mapper.readTree(scopes).get("roles").toString()
        val roles = mapper.readValue<Collection<String>>(roleStringValue)
        if (!roles.isEmpty()){
            return roles
        }
        return emptyList()
    }

    companion object {
        private val GROUPS_CLAIM = "realm_access"
        private val ROLE_PREFIX = "ROLE_"
        private val SUB = "sub"
        private val USERNAME = "username"
    }
}
