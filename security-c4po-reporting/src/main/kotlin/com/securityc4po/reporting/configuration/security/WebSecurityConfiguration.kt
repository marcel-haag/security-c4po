package com.securityc4po.reporting.configuration.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.oauth2.core.OAuth2TokenValidator
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtValidators
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoders
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration

@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@Configuration
@ComponentScan
class WebSecurityConfiguration {

    @Value("\${external.issuer-uri}")
    var externalIssuerUri: String? = null

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    var internalIssuerUri: String? = null

    @Bean
    fun setSecurityWebFilterChains(http: ServerHttpSecurity): SecurityWebFilterChain {
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
            .pathMatchers(HttpMethod.GET, "/v1/reports/**").authenticated()
            .pathMatchers("/actuator/**").permitAll()
            /*.pathMatchers("/docs/SecurityC4PO.html").permitAll()*/
            .anyExchange().authenticated()
            .and()
            .oauth2ResourceServer()
            .jwt()
            .jwtAuthenticationConverter(appuserJwtAuthenticationConverter())
        return http.build()
    }

    @Bean
    fun appuserJwtAuthenticationConverter(): AppuserJwtAuthConverter {
        return AppuserJwtAuthConverter()
    }


    @Bean
    @Profile("COMPOSE")
    fun jwtDecoder(): ReactiveJwtDecoder {
        val jwtDecoder = ReactiveJwtDecoders.fromIssuerLocation(internalIssuerUri) as NimbusReactiveJwtDecoder
        val withIssuer: OAuth2TokenValidator<Jwt> = JwtValidators.createDefaultWithIssuer(externalIssuerUri)
        jwtDecoder.setJwtValidator(withIssuer)
        return jwtDecoder
    }
}
