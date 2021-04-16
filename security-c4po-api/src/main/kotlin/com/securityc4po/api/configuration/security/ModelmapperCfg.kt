package com.securityc4po.api.configuration.security

import org.modelmapper.ModelMapper
import org.modelmapper.convention.MatchingStrategies
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ModelmapperCfg {

    @Bean
    fun modelMapper(): ModelMapper {
        val modelMapper = ModelMapper()
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT)
        return modelMapper
    }
}
