#!/usr/bin/env bash
cd keycloak/bin
sleep 20
./kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user admin --password admin

USERID=$(./kcadm.sh create users -r c4po_realm_local -s username=test_admin \
-s email=Test.Admin@heros.com \
-s firstName=test \
-s lastName=admin \
-s attributes.lang="de-DE" \
-s attributes.datenumberformat="en-US" \
-o --fields id | jq '.id' | tr -d '"')

./kcadm.sh update users/$USERID/reset-password -r c4po_realm_test -s type=password -s value=test -s temporary=false -n
./kcadm.sh add-roles --uusername test_admin --rolename c4po_admin -r c4po_realm_test
./kcadm.sh add-roles -r c4po_realm_test --uusername test_admin --cclientid realm-management --rolename create-client --rolename view-users

USERID=$(./kcadm.sh create users -r c4po_realm_local -s username=test_user \
-s email=Test.User@heros.com \
-s firstName=test \
-s lastName=user \
-s attributes.lang="de-DE" \
-s attributes.datenumberformat="en-US" \
-o --fields id | jq '.id' | tr -d '"')

./kcadm.sh update users/$USERID/reset-password -r c4po_realm_test -s type=password -s value=test -s temporary=false -n
./kcadm.sh add-roles --uusername test_user --rolename c4po_user -r c4po_realm_test
./kcadm.sh add-roles -r c4po_realm_test --uusername test_user --cclientid realm-management --rolename create-client --rolename view-users