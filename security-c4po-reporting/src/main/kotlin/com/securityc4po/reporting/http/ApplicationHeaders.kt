package com.securityc4po.reporting.http

import org.springframework.http.HttpHeaders

object ApplicationHeaders {
    const val AUTHORIZATION = HttpHeaders.AUTHORIZATION
    const val APPLICATION_NAME = "SecurityC4PO_Reporting"
    const val XVERSION = 1
}