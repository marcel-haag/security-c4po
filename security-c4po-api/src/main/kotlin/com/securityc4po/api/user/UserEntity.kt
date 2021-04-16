package com.securityc4po.api.user

import com.securityc4po.api.BaseEntity

/*
 *  @Document(collection = "user")
 *  Can be used after adding deps for mongodb
*/
open class UserEntity(
        data: User
) : BaseEntity<User>(data)
