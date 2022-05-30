# base image
FROM node:14.15.3

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# increase memory limit to avoid "heap out of memory"-error
# TODO investigate on root cause for "heap out of memory"-error
ENV NODE_OPTIONS="--max_old_space_size=4096"

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@12.2.17

# add app
COPY . /app

# start app
CMD ng serve -c compose --host 0.0.0.0
