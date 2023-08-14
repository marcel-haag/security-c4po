# Use the base Keycloak image
FROM quay.io/keycloak/keycloak:20.0.0

# Set environment variables if needed
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin
ENV KC_HTTP_RELATIVE_PATH=/auth

# Copy custom themes or configuration files if needed
# COPY my-theme /opt/keycloak/themes/my-theme

# Expose Keycloak ports
EXPOSE 8080

# Create a directory to hold imported data
RUN mkdir -p /opt/keycloak/data/import

# Copy the realm export file into the import directory
COPY c4po_realm_export.json /opt/keycloak/data/import/c4po_realm_export.json

# Set the custom entrypoint
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "--spi-login-protocol-openid-connect-legacy-logout-redirect-uri=true", "start-dev", "--import-realm"]

# Start the Keycloak server with the imported realm configuration
# CMD ["/opt/keycloak/bin/kc.sh", "start-dev", "-b", "0.0.0.0", "-Dkeycloak.import=/opt/keycloak/data/import/c4po_realm_export.json"]