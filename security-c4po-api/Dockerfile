FROM openjdk:11-jre
ENV TZ=Europe/Berlin
RUN groupadd -g 9999 security-c4po-api && \
    useradd -r -u 9999 -g security-c4po-api security-c4po-api
RUN mkdir /data
RUN chown security-c4po-api:security-c4po-api /data
USER security-c4po-api

# GET CURRENT STAGE
ARG STAGE
ENV ENV_STAGE=$STAGE

# COPY PACKAGE INTO IMAGE
COPY ./build/libs/security-c4po-api-0.0.1-SNAPSHOT.jar /
USER security-c4po-api
EXPOSE 8443

# RUN JAVA
# CMD [ "java", "-jar", "security-c4po-api-0.0.1-SNAPSHOT.jar" ]
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=${ENV_STAGE}", "security-c4po-api-0.0.1-SNAPSHOT.jar" ]
