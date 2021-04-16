import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

buildscript {
	repositories {
		mavenCentral()
		jcenter()
	}
	dependencies {
		classpath("org.springframework.boot:spring-boot-gradle-plugin:2.3.3.RELEASE")
		classpath("org.owasp:dependency-check-gradle:6.0.0")
	}
}

plugins {
	id("org.springframework.boot") version "2.3.4.RELEASE"
	id("io.spring.dependency-management") version "1.0.10.RELEASE"
	id("com.github.spotbugs") version "4.5.0"
	id("org.owasp.dependencycheck") version "6.0.0"
	id("org.asciidoctor.jvm.convert") version "2.4.0"
	kotlin("jvm") version "1.3.72"
	kotlin("plugin.spring") version "1.3.72"
	jacoco
}

group = "com.security-c4po.api"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencyCheck {
	autoUpdate = true
	cveValidForHours = 1
}

spotbugs {
	showProgress.set(true)
	tasks.spotbugsMain {
		reports.create("html") {
			isEnabled = true
		}
	}
	tasks.spotbugsTest {
		reports.create("html") {
			isEnabled = true
		}
	}
}

val snippetsDir = file("build/generated-snippets")

dependencies {
	implementation("com.fasterxml.jackson.datatype:jackson-datatype-joda:2.11.3")
	implementation("io.projectreactor.kotlin:reactor-kotlin-extensions:1.1.1")
	implementation("javax.websocket:javax.websocket-api:1.1")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	/*implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb")*/
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("com.github.spotbugs:spotbugs-annotations:4.1.2")
	implementation("org.modelmapper:modelmapper:2.3.2")

	api("org.springframework.boot:spring-boot-starter-test")
	api("org.springframework.security:spring-security-jwt:1.1.1.RELEASE")

	testImplementation("com.nhaarman.mockitokotlin2:mockito-kotlin:2.1.0")
	testImplementation("io.projectreactor:reactor-test")
	testImplementation("org.junit.jupiter:junit-jupiter-api:5.3.1")
	testImplementation("org.junit.jupiter:junit-jupiter-engine:5.3.1")
	testImplementation("org.springframework.cloud:spring-cloud-contract-wiremock:2.1.0.RELEASE")
	testImplementation("org.springframework.restdocs:spring-restdocs-webtestclient")
}

jacoco {
	toolVersion = "0.8.3"
	reportsDir = file("$buildDir/reports/coverage")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "11"
	}
}

tasks.bootJar {
	dependsOn(tasks.test, tasks.asciidoctor, tasks.jacocoTestReport, tasks.dependencyCheckAnalyze)
}

tasks.test {
	outputs.dir(snippetsDir)
}

tasks.dependencyCheckAnalyze {
	dependsOn(tasks.test, tasks.asciidoctor, tasks.jacocoTestReport)
}

//Issue with Kotlin assignment of sourceDir and outputDir: https://github.com/asciidoctor/asciidoctor-gradle-plugin/issues/458
tasks.asciidoctor {
	inputs.dir(snippetsDir)
	setSourceDir(file("src/main/asciidoc"))
	setOutputDir(file("$buildDir/asciidoc"))
	sources(delegateClosureOf<PatternSet> {
		include("SecurityC4PO.adoc")
	})

	attributes(
			mapOf(
					"snippets" to snippetsDir,
					"source-highlighter" to "coderay",
					"toc" to "left",
					"toclevels" to 3,
					"sectlinks" to true
			)
	)
	dependsOn(tasks.test)
}

tasks.jacocoTestReport {
	reports {
		xml.isEnabled = true
		csv.isEnabled = false
		html.isEnabled = true
		html.destination = file("$buildDir/reports/coverage")
	}
}
