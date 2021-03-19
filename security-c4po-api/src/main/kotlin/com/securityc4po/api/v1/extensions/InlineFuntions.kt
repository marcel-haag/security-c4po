package com.securityc4po.api.v1.extensions

import org.slf4j.LoggerFactory

inline fun <reified T> getLoggerFor() = LoggerFactory.getLogger(T::class.java)!!