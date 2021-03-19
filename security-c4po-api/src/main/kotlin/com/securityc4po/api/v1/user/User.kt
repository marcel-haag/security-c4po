package com.securityc4po.api.v1.user

data class User(
        val id: String,

        val username: String,

        val firstName: String? = null,

        val lastName: String? = null,

        val email: String? = null,

        val interfaceLang: String? = null
)