package com.securityc4po.api.configuration.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.web.cors.CorsConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
class WebSecurityConfiguration(private val userAccountDetailsService: UserAccountDetailsService) {

    @Bean
    fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        http.cors().configurationSource {
            CorsConfiguration().apply {
                this.applyPermitDefaultValues()
                this.addAllowedMethod(HttpMethod.DELETE)
                this.addAllowedMethod(HttpMethod.PATCH)
                this.addAllowedMethod(HttpMethod.POST)
                this.addAllowedMethod(HttpMethod.GET)
                this.addAllowedMethod(HttpMethod.PUT)
            }
        }
                .and()
                .csrf()
                .disable()
                .authorizeExchange()
                .pathMatchers(HttpMethod.GET, "/v1/projects/**").authenticated()
                .pathMatchers("/actuator/**").permitAll()
                .pathMatchers("/docs/SecurityC4PO.html").permitAll()
                .anyExchange().authenticated()
                .and()
                .oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(appuserJwtAuthenticationConverter())
        return http.build()
    }

    @Bean
    fun appuserJwtAuthenticationConverter(): AppuserJwtAuthConverter {
        return AppuserJwtAuthConverter(userAccountDetailsService)
    }
}