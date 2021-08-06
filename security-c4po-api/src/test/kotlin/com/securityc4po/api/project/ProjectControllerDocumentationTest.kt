package com.securityc4po.api.project

import com.github.tomakehurst.wiremock.common.Json
import com.securityc4po.api.BaseDocumentationIntTest
import com.securityc4po.api.configuration.SIC_INNER_SHOULD_BE_STATIC
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.restdocs.operation.preprocess.Preprocessors
import org.springframework.restdocs.payload.JsonFieldType
import org.springframework.restdocs.payload.PayloadDocumentation
import org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation

@AutoConfigureWireMock(port = 0)
@SuppressFBWarnings(SIC_INNER_SHOULD_BE_STATIC)
class ProjectControllerDocumentationTest : BaseDocumentationIntTest() {

    @Autowired
    lateinit var mongoTemplate: MongoTemplate

    @BeforeEach
    fun init() {
        cleanUp()
        persistBasicTestScenario()
    }

    @Nested
    inner class GetProjects {
        @Test
        fun getProjects() {
            /* Implement after the implementation of database  */

            /*webTestClient.get().uri("/v1/projects")
                    .header("")
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
                                    PayloadDocumentation.fieldWithPath("[].id").type(JsonFieldType.STRING).description("The id of the requested Project"),
                                    PayloadDocumentation.fieldWithPath("[].client").type(JsonFieldType.STRING).description("The name of the client of the requested Project"),
                                    PayloadDocumentation.fieldWithPath("[].title").type(JsonFieldType.STRING).description("The title of the requested Project"),
                                    PayloadDocumentation.fieldWithPath("[].createdAt").type(JsonFieldType.STRING).description("The date where the Project was created at"),
                                    PayloadDocumentation.fieldWithPath("[].tester").type(JsonFieldType.STRING).description("The user that is used as a tester in the Project"),
                                    PayloadDocumentation.fieldWithPath("[].logo").type(JsonFieldType.STRING).description("The sensors contained in the Project")
                            )
                    ))*/
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

    private fun cleanUp() {
        mongoTemplate.findAllAndRemove(Query(), Project::class.java)
    }

    private fun persistBasicTestScenario() {
        // setup test data
        val projectOne = Project(
                id = "260aa538-0873-43fc-84de-3a09b008646d",
                client = "",
                title = "",
                createdAt = "",
                tester = "",
                createdBy = ""
        )
        val projectTwo = Project(
                id = "260aa538-0873-43fc-84de-3a09b008646d",
                client = "",
                title = "",
                createdAt = "",
                tester = "",
                createdBy = ""
        )
        cleanUp()
        mongoTemplate.save(ProjectEntity(projectOne))
        mongoTemplate.save(ProjectEntity(projectTwo))
    }
}