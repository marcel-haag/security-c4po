FROM eclipse-temurin:11-jre
ENV TZ=UTC

ARG JAR_FILE_REPORT

RUN groupadd -g 9999 security-c4po-reporting && \
    useradd -r -u 9999 -g security-c4po-reporting security-c4po-reporting
RUN mkdir /data
RUN chown security-c4po-reporting:security-c4po-reporting /data
USER security-c4po-reporting

# GET CURRENT STAGE
ARG STAGE
ENV ENV_STAGE=$STAGE

# COPY PACKAGE INTO IMAGE
COPY ${JAR_FILE_REPORT} app.jar
USER security-c4po-reporting
EXPOSE 8444

# WAIT FOR KEYCLOAK & RUN JAVA
COPY ./wait-for-keycloak.sh /
ENTRYPOINT [ "./wait-for-keycloak.sh", "http://c4po-keycloak:8080/auth/realms/c4po_realm_local", "java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "-jar", "app.jar" ]
