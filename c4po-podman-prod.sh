#!/bin/bash
baseDir=$(pwd)
compose=$baseDir"/security-c4po-cfg/docker-compose.yml"

echo -e "
_______ _______ _______ _     _  ______ _____ _______ __   __
|______ |______ |       |     | |_____/   |      |      \_/
______| |______ |_____  |_____| |    \_ __|__    |       |         _/_/_/     _/  _/       _/_/_/         _/_/
                                                                _/           _/  _/       _/    _/     _/    _/
                                                               _/           _/_/_/_/     _/_/_/       _/    _/
                                                              _/               _/       _/           _/    _/
                                                               _/_/_/         _/       _/             _/_/
\n"

echo "---------------Pull C4PO from Docker Hub----------------"
echo -e "\n"
podman image pull --all-tags cellecram/security-c4po
echo -e "\n"

echo "-------------CLEAN UP Pod---------------"
echo -e "\n"
# podman pod rm -f c4po-prod
echo -e "\n"

echo "---------------Create Pods----------------"
echo -e "\n"
podman pod exists c4po-prod || podman pod create --name c4po-prod \
    -p 8080:8080 \
    -p 27017:27017 \
    -p 4200:4200 \
    -p 8443:8443 \
    -p 8444:8444

echo -e "\n"

echo "---------------Start Containers---------------"
echo -e "\n"
podman run --pod c4po-prod -d --name keycloak cellecram/security-c4po:keycloak
echo -e "\n"
podman run --pod c4po-prod -d --name mongo cellecram/security-c4po:mongo
echo -e "\n"
podman run --pod c4po-prod -d --name angular cellecram/security-c4po:angular
echo -e "\n"
podman run --pod c4po-prod -e "SPRING_PROFILES_ACTIVE=COMPOSE" -d --name api cellecram/security-c4po:api
echo -e "\n"
podman run --pod c4po-prod -e "SPRING_PROFILES_ACTIVE=COMPOSE" -d --name reporting cellecram/security-c4po:reporting
