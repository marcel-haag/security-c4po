package com.securityc4po.api.configuration.error.handler

enum class Errorcode(val code: Int) {
    // 1XXX Information Not Found
    ProjectsNotFound(1001),
    ProjectNotFound(1002),
    PentestNotFound(1003),

    // 2XXX Already Changed
    ProjectAlreadyChanged(2001),
    PentestAlreadyChanged(2002),

    // 3XXX Invalid Model
    ProjectInvalid(3000),
    PentestInvalid(3001),
    InsufficientData(3002),
    InvalidToken(3003),
    TokenWithoutField(3004),
    UserIdIsEmpty(3005),
    FindingInvalid(3006),

    // 4XXX Unauthorized
    ProjectAdjustmentNotAuthorized(4000),
    PentestAdjustmentNotAuthorized(4001),

    // 5XXX Server Errors
    UserIdDoesNotMatch(5000),

    // 6XXX Failed transaction
    ProjectDeletionFailed(6000),
    PentestDeletionFailed(6001),
    ProjectUpdateFailed(6002),
    PentestUpdateFailed(6003),
    ProjectFetchingFailed(6004),
    PentestFetchingFailed(6005),
    ProjectInsertionFailed(6006),
    PentestInsertionFailed(6007),
    ProjectPentestInsertionFailed(6008),
    FindingInsertionFailed(6009),
}