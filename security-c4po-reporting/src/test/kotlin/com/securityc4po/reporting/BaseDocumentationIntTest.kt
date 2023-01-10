package com.securityc4po.reporting

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

@ExtendWith(value = [RestDocumentationExtension::class, SpringExtension::class])
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
abstract class BaseDocumentationIntTest {

    @LocalServerPort
    private var port = 0

    lateinit var webTestClient: WebTestClient

    @BeforeEach
    fun setupDocs(restDocumentation: RestDocumentationContextProvider) {
        webTestClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:$port")
                .filter(documentationConfiguration(restDocumentation))
                .responseTimeout(Duration.ofMillis(10000))
                .build()
    }
}