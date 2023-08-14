version = "3"

services {
  c4po-db {
    build = {
      context = "c4po-db"
      platforms = ["linux/amd64", "linux/arm64"]
    }
    image = "mongo:5.0.0-focal"
    volumes = ["./volumes/mongodb/data/:/db/data"]
    resources = { limits = { memory = "2G" } }
    ports = ["27017:27017"]
    networks = ["c4po"]
  }

  c4po-keycloak {
    build = {
      context = "c4po-keycloak"
      platforms = ["linux/amd64", "linux/arm64"]
    }
    image = "quay.io/keycloak/keycloak:20.0.0"
    ports = ["8080:8080"]
    networks = ["c4po"]
  }

  c4po-angular {
    build = {
      context = "../security-c4po-angular"
      platforms = ["linux/amd64", "linux/arm64"]
    }
    image = "security-c4po-angular:latest"
    depends_on = ["c4po-keycloak"]
    resources = { limits = { memory = "2G" } }
    ports = ["4200:4200"]
    networks = ["c4po"]
  }

  c4po-api {
    build = {
      context = "../security-c4po-api"
      platforms = ["linux/amd64", "linux/arm64"]
    }
    image = "security-c4po-api:latest"
    environment = ["SPRING_PROFILES_ACTIVE=COMPOSE"]
    depends_on = ["c4po-db", "c4po-keycloak"]
    resources = { limits = { memory = "2G" } }
    ports = ["8443:8443"]
    networks = ["c4po"]
  }

  c4po-reporting {
    build = {
      context = "../security-c4po-reporting"
      platforms = ["linux/amd64", "linux/arm64"]
    }
    image = "security-c4po-reporting:latest"
    environment = ["SPRING_PROFILES_ACTIVE=COMPOSE"]
    depends_on = ["c4po-keycloak"]
    resources = { limits = { memory = "4G" } }
    ports = ["8444:8444"]
    networks = ["c4po"]
  }
}

networks {
  c4po {}
}

