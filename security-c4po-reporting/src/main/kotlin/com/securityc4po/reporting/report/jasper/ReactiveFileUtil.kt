package com.securityc4po.reporting.report.jasper

import reactor.core.publisher.Flux
import java.nio.file.Files
import java.nio.file.Path
import java.security.MessageDigest
import java.util.stream.Stream
import javax.xml.bind.DatatypeConverter

class ReactiveFileUtil {
    companion object {
        fun readFile(path: Path): Flux<String> {
            return Flux.using(
                { Files.lines(path) },
                { s: Stream<String>? -> Flux.fromStream(s!!) }
            ) { obj: Stream<String> -> obj.close() }
        }

        fun md5(input: String) = hashString("MD5", input)
        fun sha1(input: String) = hashString("SHA-1", input)

        private fun hashString(type: String, input: String): String {
            val bytes = MessageDigest
                .getInstance(type)
                .digest(input.toByteArray())
            return DatatypeConverter.printHexBinary(bytes).toUpperCase()
        }
    }
}
