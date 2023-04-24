FROM openjdk:11-jre
ENV TZ=Europe/Berlin
RUN groupadd -g 9999 security-c4po-reporting && \
    useradd -r -u 9999 -g security-c4po-reporting security-c4po-reporting
RUN mkdir /data
RUN chown security-c4po-reporting:security-c4po-reporting /data
USER security-c4po-reporting

# GET CURRENT STAGE
ARG STAGE
ENV ENV_STAGE=$STAGE

# COPY PACKAGE INTO IMAGE
COPY ./build/libs/security-c4po-reporting-0.0.1-SNAPSHOT.jar /
USER security-c4po-reporting
EXPOSE 8444

# WAIT FOR KEYCLOAK & RUN JAVA
COPY ./wait-for-keycloak.sh /
# CMD [ "java", "-jar", "security-c4po-reporting-0.0.1-SNAPSHOT.jar" ]
ENTRYPOINT [ "./wait-for-keycloak.sh", "http://c4po-keycloak:8080/auth/realms/c4po_realm_local", "java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "-jar", "security-c4po-reporting-0.0.1-SNAPSHOT.jar" ]
