package com.securityc4po.reporting.configuration.error.handler

import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.classic.spi.ThrowableProxy

class ErrorCodeEncoder {
    /*override*/ fun convert(event: ILoggingEvent): String {
        return if (event.throwableProxy != null) {
            val throwable = event.throwableProxy as ThrowableProxy
            val ex = throwable.throwable as C4POBaseException
            ex.errorcode.code.toString()
        } else {
            ""
        }
    }
}
