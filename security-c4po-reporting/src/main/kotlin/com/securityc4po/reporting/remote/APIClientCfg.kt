package com.securityc4po.reporting.remote

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component
import org.springframework.validation.annotation.Validated
import java.net.URL

@ConfigurationProperties("api.client")
@Validated
@Component
class APIClientCfg {
    lateinit var url: URL
    var projects = ApiPath()
    var projectReport = ApiPath()
    var pentests = ApiPath()
    val findings = ApiPath()
    val comments = ApiPath()
}

class ApiPath {
    lateinit var path: String
}
