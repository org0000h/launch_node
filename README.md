# launch_node
- High concurrency support, you can use all cpu core to start.
- based on nodejs+koa2.
- jsonwebtoken Stateless authorization.
- Freely configure HTTP, HTTPS (ECDHA encryption), websocket server startup.
- support websocket using socket.io
- Use sequelize, provide a variety of database support (postgreSQL, MySQL, sqlite...), one development can be used for multiple databases.
- Use vue-element-admin to provide fast and flexible front-end back-end management interface development. The UI is dynamically determined by data.
- Docker containerization support for easy deployment.

## start up with docker
---
automatic deployment by docker-compose,run cmd below:
```
docker-compose up
```
Use URI https://localhost:3000 to access the container.

If using vscode to debug, run 
```
docker-compose -f docker-compose-debug.yml up
```
then start the vscode,chose "attach docker" in launch.json

## or just run in localhost 
---
```
cd strawberry_koa/
npm install
npm start // or npm run debug 

```
Use URI https://localhost to access the server

## todo 
---


