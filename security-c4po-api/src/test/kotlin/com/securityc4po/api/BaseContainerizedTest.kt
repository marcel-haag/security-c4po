package com.securityc4po.api

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.github.dockerjava.api.model.ExposedPort
import com.github.dockerjava.api.model.PortBinding
import com.github.dockerjava.api.model.Ports
import com.nimbusds.jwt.JWTParser
import dasniko.testcontainers.keycloak.KeycloakContainer
import org.junit.jupiter.api.TestInstance
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.context.TestPropertySource
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestTemplate
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.wait.strategy.Wait
import org.testcontainers.images.builder.ImageFromDockerfile
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper
import org.testcontainers.utility.DockerImageName
import org.testcontainers.utility.MountableFile
import java.nio.file.Paths

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureWireMock(port = 0)
@TestPropertySource(
    properties = [
        "spring.data.mongodb.port=27017",
        "spring.data.mongodb.authentication-database=admin",
        "spring.data.mongodb.password=test",
        "spring.data.mongodb.username=testuser",
        "MONGO_DB_MAX_CONNECTION_IDLE_TIME=PT25M",
        "DATA_REFRESH_THRESHOLD_DURATION=PT30M",
        "CLEANUP_BATCH_SIZE_FOR_SELECTING_EXPIRED_USERS=100"
    ]
)
abstract class BaseContainerizedTest {
    companion object {
        val mongoDbContainer = KGenericContainer(
            ImageFromDockerfile("c4poapibasecontainerizedtest").withDockerfileFromBuilder {
                it.from("mongo:latest")
                it.env("MONGO_INITDB_ROOT_USERNAME", "root")
                it.env("MONGO_INITDB_ROOT_PASSWORD", "cjwkbencowepoc324pon2mop3mp4")
                it.env("MONGO_INITDB_DATABASE", "admin")
                it.add("insert-mongodb-user.js", "/docker-entrypoint-initdb.d")
            }.withFileFromPath("insert-mongodb-user.js", Paths.get(MountableFile.forClasspathResource("insert-mongodb-user.js", 700).resolvedPath))
        ).apply {
            withCreateContainerCmdModifier {
                it.hostConfig?.withPortBindings(PortBinding(Ports.Binding.bindPort(27017), ExposedPort(27017)))
            }
            start()
        }

        val keycloakContainer: KeycloakContainer = KeycloakContainer("quay.io/keycloak/keycloak:20.0.0")
            .withAdminUsername("admin")
            .withAdminPassword("admin")
            .withContextPath("/auth")
            .withRealmImportFile("realm-export.json")
            .waitingFor(
                Wait.forHttp("/auth")
            )


        @DynamicPropertySource
        @JvmStatic
        fun jwtValidationProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri") { keycloakContainer.authServerUrl + "/realms/c4po_realm_local" }

            keycloakContainer.start()
        }
    }

    var token = "n/a"
    var tokenAdmin = "n/a"
    var adminSub = "n/a"
    var tokenUser = "n/a"

    fun getAccessToken(username: String, password: String, clientId: String, realm: String): String {
        val restTemplate = RestTemplate()
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_FORM_URLENCODED

        val map = LinkedMultiValueMap<Any, Any>()
        map.add("client_id", clientId)
        map.add("username", username)
        map.add("password", password)
        map.add("grant_type", "password")
        map.add("client_secret", "secret")
        val responseString = restTemplate.postForObject(
            keycloakContainer.authServerUrl + "/realms/$realm/protocol/openid-connect/token",
            HttpEntity<Any>(map, headers),
            String::class.java
        )
        val token = ObjectMapper().readValue(responseString, KeyCloakToken::class.java)
        return token.access_token!!
    }

    fun getSubClaim(token: String): String {
        val jwt = JWTParser.parse(token)
        val scopes = ObjectMapper().readValue(jwt.jwtClaimsSet.toJSONObject().toJSONString(), HashMap::class.java)
        return scopes["sub"] as String
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    class KeyCloakToken(val access_token: String? = null)

    class KGenericContainerFromImage(imageName: DockerImageName) : GenericContainer<KGenericContainerFromImage>(imageName)
    class KGenericContainer(dockerFile: ImageFromDockerfile) : GenericContainer<KGenericContainer>(dockerFile)
}
