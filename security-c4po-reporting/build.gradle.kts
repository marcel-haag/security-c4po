import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

buildscript {
    repositories {
        mavenCentral()
        jcenter()
        maven {
            // jaspersoft-third-party
            url = uri("https://jaspersoft.jfrog.io/jaspersoft/third-party-ce-artifacts/")
        }
        maven {
            // JasperReports CE Releases
            url = uri("https://jaspersoft.jfrog.io/jaspersoft/jr-ce-releases")
        }
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:2.3.3.RELEASE")
    }
}

plugins {
    id("org.springframework.boot") version "2.3.4.RELEASE"
    id("io.spring.dependency-management") version "1.0.10.RELEASE"
    /*id("org.springframework.boot") version "2.7.7"
    id("io.spring.dependency-management") version "1.0.15.RELEASE"*/
    id("org.asciidoctor.jvm.convert") version "2.4.0"
    kotlin("jvm") version "1.6.21"
    kotlin("plugin.spring") version "1.6.21"
    jacoco
}

group = "com.securityc4po.reporting"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

configurations.all {
    //Little hack to retrieve the missing iText dependency from another project since it is not correctly maintained by
    //Jasper-Reports. OpenPDF is using the same iText library so this is why this hack works.
    resolutionStrategy.eachDependency {
        if (this.requested.group == "com.lowagie" && this.requested.name == "itext") {
            this.useTarget("com.github.librepdf:openpdf:1.3.30")
        }
    }
}

repositories {
    mavenCentral()
}

apply(plugin = "org.asciidoctor.jvm.convert")

val snippetsDir = file("build/generated-snippets")

dependencies {
    implementation("org.json:json:20140107")

    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    /*implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    api("org.springframework.security:spring-security-jwt:1.1.1.RELEASE")*/

    /* Reporting */
    implementation("net.sf.jasperreports:jasperreports:6.20.0")
    // https://mavenlibs.com/maven/dependency/net.sf.jasperreports/jasperreports-fonts
    implementation("net.sf.jasperreports:jasperreports-fonts:6.20.0")
    // https://mvnrepository.com/artifact/org.apache.pdfbox/pdfbox
    implementation("org.apache.pdfbox:pdfbox:2.0.1")
    // https://mvnrepository.com/artifact/commons-io/commons-io
    implementation("commons-io:commons-io:2.6")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-joda:2.11.3")

    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions:1.1.1")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("org.modelmapper:modelmapper:2.3.2")

    api("net.logstash.logback:logstash-logback-encoder:6.2")
    api("ch.qos.logback:logback-classic:1.2.3")
    api("org.springframework.boot:spring-boot-starter-test")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
    testImplementation("org.springframework.restdocs:spring-restdocs-webtestclient")
    testImplementation("org.springframework.security:spring-security-test")
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
    // ToDo: Reactivate jacocoTestReport after test written
    dependsOn(tasks.test, tasks.asciidoctor, /*tasks.jacocoTestReport*/)
}

jacoco {
    toolVersion = "0.8.3"
    reportsDir = file("$buildDir/reports/coverage")
}

//Issue with Kotlin assignment of sourceDir and outputDir: https://github.com/asciidoctor/asciidoctor-gradle-plugin/issues/458
tasks.asciidoctor {
    inputs.dir(snippetsDir)
    setSourceDir(file("src/main/asciidoc"))
    setOutputDir(file("$buildDir/asciidoc"))
    sources(delegateClosureOf<PatternSet> {
        include("ReportingC4PO.adoc")
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

tasks.test {
    outputs.dir(snippetsDir)
}

// ToDo: Reactivate after test written
/*tasks.jacocoTestReport {
    reports {
        xml.isEnabled = true
        csv.isEnabled = false
        html.isEnabled = true
        html.destination = file("$buildDir/reports/coverage")
    }
}*/
