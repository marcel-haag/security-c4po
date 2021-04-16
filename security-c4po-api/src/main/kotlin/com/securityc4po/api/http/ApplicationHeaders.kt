package com.securityc4po.api.http

import org.springframework.http.HttpHeaders

object ApplicationHeaders {
    const val AUTHORIZATION = HttpHeaders.AUTHORIZATION
    const val APPLICATION_NAME = "SecurityC4PO"
    const val XVERSION = 1
}