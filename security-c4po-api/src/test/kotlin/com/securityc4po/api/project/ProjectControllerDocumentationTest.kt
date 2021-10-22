package com.securityc4po.api.project

import com.github.tomakehurst.wiremock.common.Json
import com.securityc4po.api.BaseDocumentationIntTest
import com.securityc4po.api.configuration.NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR
import com.securityc4po.api.configuration.RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE
import com.securityc4po.api.configuration.SIC_INNER_SHOULD_BE_STATIC
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
import org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation

@SuppressFBWarnings(
    SIC_INNER_SHOULD_BE_STATIC,
    NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR,
    RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE
)
class ProjectControllerDocumentationTest : BaseDocumentationIntTest() {

    @Autowired
    lateinit var mongoTemplate: MongoTemplate

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
        fun getProjects() {
            webTestClient.get().uri("/projects")
                    .header("Authorization", "Bearer $tokenAdmin")
                    .exchange()
                    .expectStatus().isOk
                    .expectHeader().doesNotExist("")
                    .expectBody().json(Json.write(getProjectsResponse()))
                    .consumeWith(WebTestClientRestDocumentation.document("{methodName}",
                            Preprocessors.preprocessRequest(Preprocessors.prettyPrint(),
                                    Preprocessors.modifyUris().removePort(),
                                    Preprocessors.removeHeaders("Host", "Content-Length")),
                            Preprocessors.preprocessResponse(
                                    Preprocessors.prettyPrint()
                            ),
                            PayloadDocumentation.relaxedResponseFields(
                                    PayloadDocumentation.fieldWithPath("[].id").type(JsonFieldType.STRING).description("The id of the requested project"),
                                    PayloadDocumentation.fieldWithPath("[].client").type(JsonFieldType.STRING).description("The name of the client of the requested project"),
                                    PayloadDocumentation.fieldWithPath("[].title").type(JsonFieldType.STRING).description("The title of the requested project"),
                                    PayloadDocumentation.fieldWithPath("[].createdAt").type(JsonFieldType.STRING).description("The date where the project was created at"),
                                    PayloadDocumentation.fieldWithPath("[].tester").type(JsonFieldType.STRING).description("The user that is assigned as a tester in the project"),
                                PayloadDocumentation.fieldWithPath("[].createdBy").type(JsonFieldType.STRING).description("The id of the user that created the project")
                            )
                    ))
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

        private fun getProjectsResponse() = listOf(
                projectOne.toProjectResponseBody(),
                projectTwo.toProjectResponseBody()
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