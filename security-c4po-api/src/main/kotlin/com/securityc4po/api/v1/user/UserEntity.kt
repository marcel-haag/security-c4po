package com.securityc4po.api.v1.user

import com.securityc4po.api.v1.BaseEntity

/*
 *  @Document(collection = "user")
 *  Can be used after adding deps for mongodb
*/
open class UserEntity(
        data: User
) : BaseEntity<User>(data)