package com.securityc4po.api.v1.project

import com.nhaarman.mockitokotlin2.mock
import com.securityc4po.api.v1.configuration.SIC_INNER_SHOULD_BE_STATIC
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.slf4j.Logger

@SuppressFBWarnings(SIC_INNER_SHOULD_BE_STATIC)
class ProjectServiceTest {

    private val log = mock<Logger>()

    private val cut = ProjectService().apply {
        this.logger = log
    }

    @Nested
    inner class GetProjects {
        @Test
        fun `happy path - getProjects successfully`() {

        }
    }

}