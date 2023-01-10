package com.securityc4po.reporting.configuration.security
class Appuser {}

/*import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.stream.Collectors

class Appuser internal constructor(val token: String) : UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return listOf("user").stream().map {
            it.toUpperCase()
        }.map {
            ROLE_PREFIX + it
        }.map {
            SimpleGrantedAuthority(it)
        }.collect(Collectors.toList())
    }

    override fun getPassword(): String {
        return "n/a"
    }
 d
    override fun getUsername(): String {
        return "n/a"
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }

    companion object {
        private val ROLE_PREFIX = "ROLE_"
    }
}*/
