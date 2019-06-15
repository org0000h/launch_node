FROM node:10.15.3
COPY . /strawberry_koa
WORKDIR /strawberry_koa
RUN npm install 
# RUN npm install --registry=https://registry.npm.taobao.org
# CMD [ "npm", "start" ]