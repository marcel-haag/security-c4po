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
docker image pull --all-tags cellecram/security-c4po
echo -e "\n"

echo "---------------Create Network----------------"
echo -e "\n"
docker network create -d bridge c4po
echo -e "\n"

echo "---------------Start Containers---------------"
echo -e "\n"
docker run --network=c4po --name c4po-keycloak -d -p 8080:8080 cellecram/security-c4po:keycloak
echo -e "\n"
docker run --network=c4po --name c4po-db -d -p 27017:27017 cellecram/security-c4po:mongo
echo -e "\n"
docker run --network=c4po --name c4po-angular -d -p 4200:4200 cellecram/security-c4po:angular
echo -e "\n"
docker run --network=c4po -e "SPRING_PROFILES_ACTIVE=COMPOSE" --name c4po-api -d -p 8443:8443 cellecram/security-c4po:api
echo -e "\n"
docker run --network=c4po -e "SPRING_PROFILES_ACTIVE=COMPOSE" --name c4po-reporting -d -p 8444:8444 cellecram/security-c4po:reporting
