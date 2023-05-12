package com.securityc4po.api

import com.github.cloudyrock.spring.v5.EnableMongock
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableMongock
class SecurityC4POApplication

fun main(args: Array<String>) {
	runApplication<SecurityC4POApplication>(*args)
}
