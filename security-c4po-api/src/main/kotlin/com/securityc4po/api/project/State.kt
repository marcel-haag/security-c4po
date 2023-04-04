package com.securityc4po.api.project

enum class PentestState {
    NEW,
    NEEDS_MORE_INFO,
    // Report states depending on customer feedback
    PRE_SUBMISSION,
    PENDING,
    TRIAGED,
    RETESTING,
    // Report states for closed submissions
    RESOLVED,
    INFORMATIVE,
    DUPLICATE,
    NOT_APPLICABLE,
    SPAM,
    OUT_OF_SCOPE,
    ACCEPTED_RISK
}