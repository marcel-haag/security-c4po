#!/bin/bash
baseDir=$(pwd)

composeDir=$baseDir"/security-c4po-cfg"
compose=$baseDir"/security-c4po-cfg/docker-compose.yml"
keycloakVolume="security-c4po-cfg/volumes/keycloak/data/*"
mongoVolume="security-c4po-cfg/volumes/mongodb/data/*"

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
docker-compose -f ${compose} build c4po-api
echo -e "\n"
echo " - Frontend: "
#docker-compose -f ${compose} build c4po-angular
echo -e "\n"

echo "------------Start Docker Container------------"
echo -e "\n"
 docker-compose -f ${compose} up # --scale c4po-angular=0
