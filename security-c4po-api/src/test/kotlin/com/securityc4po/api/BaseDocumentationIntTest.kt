package com.securityc4po.api

import com.securityc4po.api.configuration.MESSAGE_NOT_INITIALIZED_REDUNDANT_NULLCHECK
import com.securityc4po.api.configuration.NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR
import com.securityc4po.api.configuration.RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.restdocs.RestDocumentationContextProvider
import org.springframework.restdocs.RestDocumentationExtension
import org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation.documentationConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.reactive.server.WebTestClient
import java.time.Duration

@SuppressFBWarnings(NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR, RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE, MESSAGE_NOT_INITIALIZED_REDUNDANT_NULLCHECK)
@ExtendWith(value = [RestDocumentationExtension::class, SpringExtension::class])
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
abstract class BaseDocumentationIntTest : BaseContainerizedTest() {

    @LocalServerPort
    private var port = 0

    lateinit var webTestClient: WebTestClient

    @BeforeEach
    fun setupDocs(restDocumentation: RestDocumentationContextProvider) {
        webTestClient = WebTestClient.bindToServer()
                .baseUrl("com.securityc4po.api.http://localhost:$port")
                .filter(documentationConfiguration(restDocumentation))
                .responseTimeout(Duration.ofMillis(10000))
                .build()
    }
}