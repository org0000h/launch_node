# strwaberry_koa
support 4 kind of servers:
- http
- https
- websocket
- websocket over tls

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


