# base image
FROM node:14

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN NODE_ENV=development npm install
RUN NODE_ENV=development npm install -g @angular/cli@12.2.17

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0
