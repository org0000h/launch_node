FROM node:latest
COPY . /launch_node
WORKDIR /launch_node
RUN npm install 
# RUN npm install --registry=https://registry.npm.taobao.org
# CMD [ "npm", "start" ]