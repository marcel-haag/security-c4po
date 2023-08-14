#!/bin/sh
# wait-for-keycloak.sh

set -e

host="$1"
shift

printf 'Waiting for Keycloak...'
until $(curl --output /dev/null --silent --head --fail $host); do
    printf '.'
    sleep 4
done

printf '\nKeycloak is up and running - Starting C4PO API'

exec "$@"