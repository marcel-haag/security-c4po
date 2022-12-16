package com.securityc4po.api.comment

import com.github.tomakehurst.wiremock.common.Json
import com.securityc4po.api.BaseIntTest
import com.securityc4po.api.configuration.NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR
import com.securityc4po.api.configuration.RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE
import com.securityc4po.api.configuration.SIC_INNER_SHOULD_BE_STATIC
import com.securityc4po.api.pentest.Pentest
import com.securityc4po.api.pentest.PentestCategory
import com.securityc4po.api.pentest.PentestEntity
import com.securityc4po.api.pentest.PentestStatus
import com.securityc4po.api.project.Project
import com.securityc4po.api.project.ProjectEntity
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
class CommentControllerIntegrationTest: BaseIntTest() {

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
    inner class GetComments {
        @Test
        fun `requesting comments by pentestId successfully`() {
            val pentestTwoId = "43fbc63c-f624-11ec-b939-0242ac120002"
            webTestClient.get()
                .uri("/pentests/{pentestId}/comments", pentestTwoId)
                .header("Authorization", "Bearer $tokenAdmin")
                .exchange()
                .expectStatus().isOk
                .expectHeader().valueEquals("Application-Name", "SecurityC4PO")
                .expectBody().json(Json.write(getComments()))
        }

        private val commentOne = Comment(
            id = "ab62d365-1b1d-4da1-89bc-5496616e220f",
            title = "Found Bug",
            description = "OTG-INFO-002 Bug",
            relatedFindings = emptyList()
        )

        private fun getComments() = listOf(
            commentOne.toCommentResponseBody()
        )
    }

    @Nested
    inner class SaveComment {
        @Test
        fun `save comment successfully`() {
            val pentestTwoId = "43fbc63c-f624-11ec-b939-0242ac120002"
            webTestClient.post()
                .uri("/pentests/{pentestId}/comment", pentestTwoId)
                .header("Authorization", "Bearer $tokenAdmin")
                .body(Mono.just(commentBody), CommentRequestBody::class.java)
                .exchange()
                .expectStatus().isAccepted
                .expectHeader().valueEquals("Application-Name", "SecurityC4PO")
                .expectBody()
                .jsonPath("$.title").isEqualTo("Found another Bug")
                .jsonPath("$.description").isEqualTo("Another OTG-INFO-002 Bug")
                .jsonPath("$.relatedFindings").isEmpty
        }

        private val commentBody = CommentRequestBody(
            title = "Found another Bug",
            description = "Another OTG-INFO-002 Bug",
            relatedFindings = emptyList()
        )
    }

    private fun persistBasicTestScenario() {
        // setup test data
        // project
        val projectOne = Project(
            id = "d2e126ba-f608-11ec-b939-0242ac120025",
            client = "E Corp",
            title = "Some Mock API (v1.0) Scanning",
            createdAt = "2021-01-10T18:05:00Z",
            tester = "Novatester",
            createdBy = "f8aab31f-4925-4242-a6fa-f98135b4b032"
        )
        // pentests
        val pentestOne = Pentest(
            id = "9c8af320-f608-11ec-b939-0242ac120002",
            projectId = "d2e126ba-f608-11ec-b939-0242ac120025",
            category = PentestCategory.INFORMATION_GATHERING,
            refNumber = "OTG-INFO-001",
            status = PentestStatus.NOT_STARTED,
            findingIds = emptyList(),
            commentIds = emptyList()
        )
        val pentestTwo = Pentest(
            id = "43fbc63c-f624-11ec-b939-0242ac120002",
            projectId = "d2e126ba-f608-11ec-b939-0242ac120025",
            category = PentestCategory.INFORMATION_GATHERING,
            refNumber = "OTG-INFO-002",
            status = PentestStatus.IN_PROGRESS,
            findingIds = emptyList(),
            commentIds = listOf("ab62d365-1b1d-4da1-89bc-5496616e220f")
        )
        val pentestThree = Pentest(
            id = "16vbc63c-f624-11ec-b939-0242ac120002",
            projectId = "d2e126ba-f608-11ec-b939-0242ac120025",
            category = PentestCategory.AUTHENTICATION_TESTING,
            refNumber = "OTG-AUTHN-001",
            status = PentestStatus.COMPLETED,
            findingIds = emptyList(),
            commentIds = emptyList()
        )
        // Comment
        val commentOne = Comment(
            id = "ab62d365-1b1d-4da1-89bc-5496616e220f",
            title = "Found Bug",
            description = "OTG-INFO-002 Bug",
            relatedFindings = emptyList()
        )
        // persist test data in database
        mongoTemplate.save(ProjectEntity(projectOne))
        mongoTemplate.save(PentestEntity(pentestOne))
        mongoTemplate.save(PentestEntity(pentestTwo))
        mongoTemplate.save(PentestEntity(pentestThree))
        mongoTemplate.save(CommentEntity(commentOne))
    }

    private fun configureAdminToken() {
        tokenAdmin = getAccessToken("test_admin", "test", "c4po_local", "c4po_realm_local")
    }

    private fun cleanUp() {
        mongoTemplate.findAllAndRemove(Query(), ProjectEntity::class.java)
        mongoTemplate.findAllAndRemove(Query(), PentestEntity::class.java)
        mongoTemplate.findAllAndRemove(Query(), CommentEntity::class.java)

        tokenAdmin = "n/a"
    }
}