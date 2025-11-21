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

echo "-------------CLEAN UP Container---------------"
echo -e "\n"
#docker rm -f c4po-keycloak     ### toggle to clear keycloak with every start ###
#docker rm -f c4po-db           ### toggle to clear database with every start ###
docker rm -f c4po-reporting
docker rm -f c4po-api
docker rm -f c4po-angular
echo -e "\n"

echo "-----------------Start Build------------------"
echo " - Report Engine: "
docker-compose -f ${compose} build c4po-db
echo " - Report Engine: "
docker-compose -f ${compose} build c4po-keycloak
echo -e "\n"
echo " - Report Engine: "
docker-compose -f ${compose} build c4po-reporting --build-arg JAR_FILE_REPORT=./build/libs/security-c4po-reporting-0.0.1-SNAPSHOT.jar ### toggle for additional build args ###
echo -e "\n"
echo " - Backend: "
docker-compose -f ${compose} build c4po-api --build-arg JAR_FILE_API=./build/libs/security-c4po-api-0.0.1-SNAPSHOT.jar ### toggle for additional build args ###
echo -e "\n"
echo " - Frontend: "
docker-compose -f ${compose} build c4po-angular
echo -e "\n"

echo "------------Start Docker Container------------"
echo -e "\n"
docker-compose -f ${compose} up -d
