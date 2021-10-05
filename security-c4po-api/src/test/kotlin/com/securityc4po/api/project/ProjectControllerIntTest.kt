package com.securityc4po.api.project

import com.github.tomakehurst.wiremock.common.Json
import com.securityc4po.api.BaseIntTest
import com.securityc4po.api.configuration.SIC_INNER_SHOULD_BE_STATIC
import com.securityc4po.api.configuration.URF_UNREAD_FIELD
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.test.web.reactive.server.WebTestClient
import java.time.Duration

/*@TestPropertySource(
    properties = [
        "keycloak.client.url=http://localhost:${'$'}{wiremock.server.port}"
    ]
)*/
@AutoConfigureWireMock(port = 0)
@SuppressFBWarnings(
    SIC_INNER_SHOULD_BE_STATIC,
    URF_UNREAD_FIELD,
    "Unread field will become used after database implementation"
)
class ProjectControllerIntTest : BaseIntTest() {

    @LocalServerPort
    private var port = 0

    // @Value("\${static-jwt.valid-token}")
    private var newToken: String = ""

    @Autowired
    lateinit var mongoTemplate: MongoTemplate

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
        cleanUp()
        configureAdminToken()
        persistBasicTestScenario()
    }

    @Nested
    inner class GetProjects {
        @Test
        fun `requesting projects successfully`() {
            println(newToken)
            webTestClient.get().uri("/v1/projects")
                .header("Authorization", "Bearer $newToken")
                .exchange()
                .expectStatus().isOk
                .expectHeader().valueEquals("Application-Name", "security-c4po-api")
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

    private fun cleanUp() {
        mongoTemplate.findAllAndRemove(Query(), Project::class.java)

        token = "n/a"
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
        cleanUp()
        mongoTemplate.save(ProjectEntity(projectOne))
        mongoTemplate.save(ProjectEntity(projectTwo))
    }

    private fun configureAdminToken() {
        newToken = getAccessToken("test_admin", "test", "c4po_local", "c4po_realm_local")
    }
}