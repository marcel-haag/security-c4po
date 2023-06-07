FROM openjdk:11-jre
ENV TZ=UTC

#ARG JAR_FILE_API

#RUN if [[ -z "$JAR_FILE_API" ]] ; then COPY ./build/libs/security-c4po-api-0.0.1-SNAPSHOT.jar app.jar / ; else COPY ${JAR_FILE_API} app.jar ; fi

#COPY ${JAR_FILE_API} app.jar

RUN groupadd -g 9999 security-c4po-api && \
    useradd -r -u 9999 -g security-c4po-api security-c4po-api
RUN mkdir /data
RUN chown security-c4po-api:security-c4po-api /data
USER security-c4po-api

# COPY PACKAGE INTO IMAGE
COPY ./build/libs/security-c4po-api-0.0.1-SNAPSHOT.jar /
USER security-c4po-api
EXPOSE 8443

# WAIT FOR KEYCLOAK & RUN JAVA
COPY ./wait-for-keycloak.sh /
# CMD [ "java", "-jar", "security-c4po-api-0.0.1-SNAPSHOT.jar" ]
ENTRYPOINT [ "./wait-for-keycloak.sh", "http://c4po-keycloak:8080/auth/realms/c4po_realm_local", "java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "-jar", "security-c4po-api-0.0.1-SNAPSHOT.jar" ]
#ENTRYPOINT [ "./wait-for-keycloak.sh", "http://c4po-keycloak:8080/auth/realms/c4po_realm_local", "java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "-jar", "app.jar" ]