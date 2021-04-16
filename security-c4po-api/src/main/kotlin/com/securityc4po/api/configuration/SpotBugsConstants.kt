package com.securityc4po.api.configuration

// Constants for SpotBugs warning suppressions
const val NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR = "NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR"
const val RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE = "RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE"
const val BC_BAD_CAST_TO_ABSTRACT_COLLECTION = "BC_BAD_CAST_TO_ABSTRACT_COLLECTION"
const val UC_USELESS_OBJECT = "UC_USELESS_OBJECT"
const val NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE = "NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE"
const val SE_BAD_FIELD = "SE_BAD_FIELD"
const val EI_EXPOSE_REP = "EI_EXPOSE_REP"
const val ST_WRITE_TO_STATIC_FROM_INSTANCE_METHOD = "ST_WRITE_TO_STATIC_FROM_INSTANCE_METHOD"
const val SIC_INNER_SHOULD_BE_STATIC = "SIC_INNER_SHOULD_BE_STATIC"
const val URF_UNREAD_FIELD = "URF_UNREAD_FIELD"

// Messages for SpotBugs warning suppressions
const val MESSAGE_BAD_CAST_TO_ABSTRACT_COLLECTION = "Collection is automatically casted to abstract class."
const val MESSAGE_NOT_INITIALIZED_REDUNDANT_NULLCHECK = "Value gets automatically initialized and checked for null"
const val MESSAGE_USELESS_OBJECT = "Objects are instantiated for code readability."
const val MESSAGE_NULL_ON_SOME_PATH = "Null is a valid value in this case."