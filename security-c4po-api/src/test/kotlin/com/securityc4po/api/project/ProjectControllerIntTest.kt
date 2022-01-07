package com.securityc4po.api.project

import com.github.tomakehurst.wiremock.common.Json
import com.securityc4po.api.BaseIntTest
import com.securityc4po.api.configuration.NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR
import com.securityc4po.api.configuration.RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE
import com.securityc4po.api.configuration.SIC_INNER_SHOULD_BE_STATIC
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.test.web.reactive.server.WebTestClient
import reactor.core.publisher.Mono
import java.time.Duration

@SuppressFBWarnings(
    SIC_INNER_SHOULD_BE_STATIC,
    NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR,
    RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE
)
class ProjectControllerIntTest : BaseIntTest() {

    @LocalServerPort
    private var port = 0

    @Autowired
    lateinit var mongoTemplate: MongoTemplate

    @Autowired
    private lateinit var webTestClient: WebTestClient

    @BeforeEach
    fun setupWebClient() {
        webTestClient = WebTestClient.bindToServer()
            .baseUrl("http://localhost:$port")
            .responseTimeout(Duration.ofMillis(10000))
            .build()
    }

    @BeforeEach
    fun init() {
        configureAdminToken()
        persistBasicTestScenario()
    }

    @AfterEach
    fun destroy() {
        cleanUp()
    }

    @Nested
    inner class GetProjects {
        @Test
        fun `requesting projects successfully`() {
            webTestClient.get().uri("/projects")
                .header("Authorization", "Bearer $tokenAdmin")
                .exchange()
                .expectStatus().isOk
                .expectHeader().valueEquals("Application-Name", "SecurityC4PO")
                .expectBody().json(Json.write(getProjects()))
        }

        val projectOne = Project(
            id = "4f6567a8-76fd-487b-8602-f82d0ca4d1f9",
            client = "E Corp",
            title = "Some Mock API (v1.0) Scanning",
            createdAt = "2021-01-10T18:05:00Z",
            tester = "Novatester",
            createdBy = "f8aab31f-4925-4242-a6fa-f98135b4b032"
        )
        val projectTwo = Project(
            id = "61360a47-796b-4b3f-abf9-c46c668596c5",
            client = "Allsafe",
            title = "CashMyData (iOS)",
            createdAt = "2021-01-10T18:05:00Z",
            tester = "Elliot",
            createdBy = "f8aab31f-4925-4242-a6fa-f98135b4b032"
        )

        private fun getProjects() = listOf(
            projectOne.toProjectResponseBody(),
            projectTwo.toProjectResponseBody()
        )
    }

    @Nested
    inner class SaveProject {
        @Test
        fun `save project successfully`() {
            webTestClient.post().uri("/projects")
                .header("Authorization", "Bearer $tokenAdmin")
                .body(Mono.just(project), ProjectRequestBody::class.java)
                .exchange()
                .expectStatus().isAccepted
                .expectHeader().valueEquals("Application-Name", "SecurityC4PO")
                .expectBody().json(Json.write(project))
                .jsonPath("$.client").isEqualTo("Novatec")
                .jsonPath("$.title").isEqualTo("log4j Pentest")
                .jsonPath("$.tester").isEqualTo("Stipe")
                .jsonPath("$.createdBy").isEqualTo("f8aab31f-4925-4242-a6fa-f98135b4b032")
        }

        val project = Project(
            id = "4f6567a8-76fd-487b-8602-f82d0ca4d1f9",
            client = "Novatec",
            title = "log4j Pentest",
            createdAt = "2021-04-10T18:05:00Z",
            tester = "Stipe",
            createdBy = "f8aab31f-4925-4242-a6fa-f98135b4b032"
        )
    }

    private fun persistBasicTestScenario() {
        // setup test data
        val projectOne = Project(
            id = "4f6567a8-76fd-487b-8602-f82d0ca4d1f9",
            client = "E Corp",
            title = "Some Mock API (v1.0) Scanning",
            createdAt = "2021-01-10T18:05:00Z",
            tester = "Novatester",
            createdBy = "f8aab31f-4925-4242-a6fa-f98135b4b032"
        )
        val projectTwo = Project(
            id = "61360a47-796b-4b3f-abf9-c46c668596c5",
            client = "Allsafe",
            title = "CashMyData (iOS)",
            createdAt = "2021-01-10T18:05:00Z",
            tester = "Elliot",
            createdBy = "f8aab31f-4925-4242-a6fa-f98135b4b032"
        )
        // persist test data in database
        mongoTemplate.save(ProjectEntity(projectOne))
        mongoTemplate.save(ProjectEntity(projectTwo))
    }

    private fun configureAdminToken() {
        tokenAdmin = getAccessToken("test_admin", "test", "c4po_local", "c4po_realm_local")
    }

    private fun cleanUp() {
        mongoTemplate.findAllAndRemove(Query(), ProjectEntity::class.java)

        tokenAdmin = "n/a"
    }
}