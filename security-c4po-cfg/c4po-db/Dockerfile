# Use an official MongoDB as the base image
FROM mongo:5.0.0-focal

# Set environment variables for MongoDB
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=Test1234!
ENV MONGO_INITDB_DATABASE=admin

# Copy custom configuration file if needed
# COPY mongod.conf /etc/mongod.conf

# Expose MongoDB default port
EXPOSE 27017

# Start MongoDB server
CMD ["mongod"]