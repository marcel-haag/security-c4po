package com.securityc4po.api.comment

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.tomakehurst.wiremock.common.Json
import com.securityc4po.api.BaseDocumentationIntTest
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
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.restdocs.operation.preprocess.Preprocessors
import org.springframework.restdocs.payload.JsonFieldType
import org.springframework.restdocs.payload.PayloadDocumentation
import org.springframework.restdocs.request.RequestDocumentation
import org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation
import reactor.core.publisher.Mono

@SuppressFBWarnings(
    SIC_INNER_SHOULD_BE_STATIC,
    NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR,
    RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE
)
class CommentControllerDocumentationTest : BaseDocumentationIntTest()  {

    @Autowired
    lateinit var mongoTemplate: MongoTemplate
    var mapper = ObjectMapper()

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
        fun getCommentsByPentestId() {
            val pentestTwoId = "43fbc63c-f624-11ec-b939-0242ac120002"
            webTestClient.get()
                .uri("/pentests/{pentestId}/comments", pentestTwoId)
                .header("Authorization", "Bearer $tokenAdmin")
                .exchange()
                .expectStatus().isOk
                .expectHeader().doesNotExist("")
                .expectBody().json(Json.write(getCommentsResponse()))
                .consumeWith(
                    WebTestClientRestDocumentation.document(
                        "{methodName}",
                        Preprocessors.preprocessRequest(
                            Preprocessors.prettyPrint(),
                            Preprocessors.modifyUris().removePort(),
                            Preprocessors.removeHeaders("Host", "Content-Length")
                        ),
                        Preprocessors.preprocessResponse(
                            Preprocessors.prettyPrint()
                        ),
                        RequestDocumentation.relaxedPathParameters(
                            RequestDocumentation.parameterWithName("pentestId").description("The id of the pentest you want to get the comments for")
                        ),
                        PayloadDocumentation.relaxedResponseFields(
                            PayloadDocumentation.fieldWithPath("[].id").type(JsonFieldType.STRING)
                                .description("The id of the requested comment"),
                            PayloadDocumentation.fieldWithPath("[].title").type(JsonFieldType.STRING)
                                .description("The title of the requested comment"),
                            PayloadDocumentation.fieldWithPath("[].description").type(JsonFieldType.STRING)
                                .description("The description number of the comment"),
                            PayloadDocumentation.fieldWithPath("[].relatedFindings").type(JsonFieldType.ARRAY)
                                .description("List of related Findings of the comment")
                        )
                    )
                )
        }

        private val commentOne = Comment(
            id = "ab62d365-1b1d-4da1-89bc-5496616e220f",
            title = "Found Bug",
            description = "OTG-INFO-002 Bug",
            relatedFindings = emptyList()
        )

        private fun getCommentsResponse() = listOf(
            commentOne.toCommentResponseBody()
        )
    }

    @Nested
    inner class SaveComment {
        @Test
        fun saveCommentByPentestId() {
            val pentestTwoId = "43fbc63c-f624-11ec-b939-0242ac120002"
            webTestClient.post()
                .uri("/pentests/{pentestId}/comment", pentestTwoId)
                .header("Authorization", "Bearer $tokenAdmin")
                .body(Mono.just(commentBody), CommentRequestBody::class.java)
                .exchange()
                .expectStatus().isAccepted
                .expectHeader().doesNotExist("")
                .expectBody().json(Json.write(commentBody))
                .consumeWith(
                    WebTestClientRestDocumentation.document(
                        "{methodName}",
                        Preprocessors.preprocessRequest(
                            Preprocessors.prettyPrint(),
                            Preprocessors.modifyUris().removePort(),
                            Preprocessors.removeHeaders("Host", "Content-Length")
                        ),
                        Preprocessors.preprocessResponse(
                            Preprocessors.prettyPrint()
                        ),
                        RequestDocumentation.relaxedPathParameters(
                            RequestDocumentation.parameterWithName("pentestId").description("The id of the pentest you want to save the comment for")
                        ),
                        PayloadDocumentation.relaxedResponseFields(
                            PayloadDocumentation.fieldWithPath("id").type(JsonFieldType.STRING)
                                .description("The id of the saved comment"),
                            PayloadDocumentation.fieldWithPath("title").type(JsonFieldType.STRING)
                                .description("The title of the comment"),
                            PayloadDocumentation.fieldWithPath("description").type(JsonFieldType.STRING)
                                .description("The description of the comment"),
                            PayloadDocumentation.fieldWithPath("relatedFindings").type(JsonFieldType.ARRAY)
                                .description("List of related findings of the comment")
                        )
                    )
                )
        }

        private val commentBody = CommentRequestBody(
            title = "Found another Bug",
            description = "Another OTG-INFO-002 Bug",
            relatedFindings = emptyList()
        )
    }

    private fun persistBasicTestScenario() {
        // setup test data
        // Project
        val projectOne = Project(
            id = "d2e126ba-f608-11ec-b939-0242ac120025",
            client = "E Corp",
            title = "Some Mock API (v1.0) Scanning",
            createdAt = "2021-01-10T18:05:00Z",
            tester = "Novatester",
            projectPentests = emptyList(),
            createdBy = "f8aab31f-4925-4242-a6fa-f98135b4b032"
        )
        // Pentests
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
            id = "74eae112-f62c-11ec-b939-0242ac120002",
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