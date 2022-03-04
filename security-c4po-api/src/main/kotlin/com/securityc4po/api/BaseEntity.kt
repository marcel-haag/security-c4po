package com.securityc4po.api

import com.securityc4po.api.configuration.MESSAGE_NOT_INITIALIZED_REDUNDANT_NULLCHECK
import com.securityc4po.api.configuration.NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR
import com.securityc4po.api.configuration.RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.springframework.data.annotation.Id
import java.time.Instant

@SuppressFBWarnings(
        NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR,
        RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE,
        MESSAGE_NOT_INITIALIZED_REDUNDANT_NULLCHECK
)
abstract class BaseEntity<T>(
        var data: T
) {
        @Id
        lateinit var id: String

        var lastModified: Instant = Instant.now()

        fun setLastModifiedToCurrentInstant() {
                this.lastModified = Instant.now()
        }
}

