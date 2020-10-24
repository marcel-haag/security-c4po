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
	kotlin("jvm") version "1.3.72"
	kotlin("plugin.spring") version "1.3.72"
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
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("com.github.spotbugs:spotbugs-annotations:4.1.2")
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test") {
		exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
	}
	testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
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
	dependsOn(tasks.test, tasks.dependencyCheckAnalyze)
}

tasks.test {
	outputs.dir(snippetsDir)
}

tasks.dependencyCheckAnalyze {
	dependsOn(tasks.test)
}
