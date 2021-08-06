#!/bin/bash
baseDir=$(pwd)

composeDir=$baseDir"/security-c4po-cfg"
keycloakVolume="security-c4po-cfg/volumes/keycloak/data/*"
mongoVolume="security-c4po-cfg/volumes/mongodb/data/*"

composeKeycloak=$baseDir"/security-c4po-cfg/kc/docker-compose.keycloak.yml"
composeDatabase=$baseDir"/security-c4po-cfg/mongodb/docker-compose.mongodb.yml"
composeFrontend=$baseDir"/security-c4po-cfg/frontend/docker-compose.frontend.yml"
composeBackend=$baseDir"/security-c4po-cfg/backend/docker-compose.backend.yml"

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

echo "-------------CLEAN UP Container---------------"
echo -e "\n"
rm -r ${keycloakVolume}
docker rm -f c4po-keycloak
docker rm -f c4po-keycloak-postgres
docker rm -f c4po-db
docker rm -f c4po-api
docker rm -f c4po-angular
echo -e "\n"
echo "-----------------Start Build------------------"
echo -e "\n"
echo " - Backend: "
docker-compose -f ${composeBackend} build
echo -e "\n"
echo " - Frontend: "
docker-compose -f ${composeFrontend} build
echo -e "\n"
# docker-compose -f ${compose} up

echo "------------Start Docker Container------------"
echo -e "\n"
docker-compose -f ${composeKeycloak} -f ${composeDatabase} -f ${composeBackend} -f ${composeFrontend} up
# docker-compose -f ${compose} up
