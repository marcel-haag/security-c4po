package com.securityc4po.api.v1.project

import com.github.tomakehurst.wiremock.common.Json
import com.securityc4po.api.v1.BaseIntTest
import com.securityc4po.api.v1.configuration.SIC_INNER_SHOULD_BE_STATIC
import com.securityc4po.api.v1.configuration.URF_UNREAD_FIELD
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock
import org.springframework.test.web.reactive.server.WebTestClient
import java.time.Duration

@AutoConfigureWireMock(port = 0)
@SuppressFBWarnings(SIC_INNER_SHOULD_BE_STATIC, URF_UNREAD_FIELD, "Unread field will become used after database implementation")
class ProjectControllerIntTest : BaseIntTest() {

    @LocalServerPort
    private var port = 0

    private lateinit var webTestClient: WebTestClient

    @BeforeEach
    fun setupWebClient() {
        webTestClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:$port")
                .responseTimeout(Duration.ofMillis(10000))
                .build()
    }

    /*@Autowired
    lateinit var mongoTemplate: MongoTemplate*/

    @BeforeEach
    fun init() {
        cleanUp()
        persistBasicTestScenario()
    }

    @Nested
    inner class GetProjects {
        @Test
        fun `requesting projects successfully`() {
            /* Implement after the implementation of database  */

            /*webTestClient.get().uri("/v1/projects")
                    .header("")
                    .exchange()
                    .expectStatus().isOk
                    .expectHeader().doesNotExist("")
                    .expectBody().json(Json.write(getProjects()))*/
        }

        val projectOne = Project(
                id = "4f6567a8-76fd-487b-8602-f82d0ca4d1f9",
                client = "E Corp",
                title = "Some Mock API (v1.0) Scanning",
                createdAt = "2021-01-10T18:05:00Z",
                tester = "Novatester",
                logo = "Insert'E_Corp.png'BASE64Encoded"
        )
        val projectTwo = Project(
                id = "61360a47-796b-4b3f-abf9-c46c668596c5",
                client = "Allsafe",
                title = "CashMyData (iOS)",
                createdAt = "2021-01-10T18:05:00Z",
                tester = "Elliot",
                logo = "Insert'Allsafe.png'BASE64Encoded"
        )

        private fun getProjects() = listOf(
                projectOne.toProjectResponseBody(),
                projectTwo.toProjectResponseBody()
        )
    }

    private fun cleanUp() {
        /*mongoTemplate.findAllAndRemove(Query(), Project::class.java)*/
    }

    private fun persistBasicTestScenario() {
        // setup test data
        val projectOne = Project(
                id = "4f6567a8-76fd-487b-8602-f82d0ca4d1f9",
                client = "E Corp",
                title = "Some Mock API (v1.0) Scanning",
                createdAt = "2021-01-10T18:05:00Z",
                tester = "Novatester",
                logo = "Insert'E_Corp.png'BASE64Encoded"
        )
        val projectTwo = Project(
                id = "61360a47-796b-4b3f-abf9-c46c668596c5",
                client = "Allsafe",
                title = "CashMyData (iOS)",
                createdAt = "2021-01-10T18:05:00Z",
                tester = "Elliot",
                logo = "Insert'Allsafe.png'BASE64Encoded"
        )
        cleanUp()
        /*mongoTemplate.save(ProjectEntity(projectOne))
        mongoTemplate.save(ProjectEntity(projectTwo))*/
    }
}